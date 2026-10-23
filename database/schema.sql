-- ==============================================================================
-- نظام إدارة مبيعات بيت التمكين للتسويق وفروعها (غزارة + معين)
-- Bayt Al-Tamkeen Sales & Charity Management System
-- Database Engine: PostgreSQL 15+ / 16+ (Compatible with Supabase / Neon / AWS RDS)
-- ==============================================================================

-- تفعيل الامتدادات اللازمة لتوليد المعرفات الفريدة ودعم التشفير والبحث
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. التسلسلات التلقائية للأرقام المرجعية (Reference Number Sequences)
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS seq_requests_2026 START WITH 1001 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_donation_bonds_2026 START WITH 1001 INCREMENT BY 1;

-- ------------------------------------------------------------------------------
-- 2. جدول الجهات التعاقدية (Contract Entities)
-- تشمل: بيت التمكين للتسويق (الشركة الأم)، غزارة للتسويق، معين الرقمية التجارية
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contract_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE CHECK (code IN ('BAYT_TAMKEEN', 'GHAZARA', 'MOEEN')),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    cr_number TEXT NOT NULL, -- رقم السجل التجاري
    tax_number TEXT,         -- الرقم الضريبي
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'الرياض',
    address TEXT,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    settings JSONB NOT NULL DEFAULT '{
        "primary_color": "#6B21C8",
        "accent_color": "#FF6B2B",
        "default_commission_rate": 5.00,
        "auto_archive_days": 90
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. جدول المستخدمين ونظام الصلاحيات (Users & RBAC)
-- الأدوار: مدير نظام (admin)، مدير مبيعات (sales_manager)، مسوق (marketer)، محاسب (accountant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    name TEXT NOT NULL CHECK (length(trim(name)) >= 3),
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT NOT NULL,
    national_id TEXT, -- الهوية الوطنية / الإقامة
    role TEXT NOT NULL CHECK (role IN ('admin', 'sales_manager', 'marketer', 'accountant')),
    
    -- نظام صلاحيات دقيق (Fine-grained RBAC Permissions) بصيغة JSONB
    permissions JSONB NOT NULL DEFAULT '{
        "can_view_all_requests": false,
        "can_create_request": false,
        "can_approve_request": false,
        "can_upload_bond": false,
        "can_verify_bond": false,
        "can_manage_associations": false,
        "can_manage_licenses": false,
        "can_calculate_commissions": false,
        "can_approve_payroll": false,
        "can_view_operation_logs": false,
        "can_export_reports": false
    }'::jsonb,
    
    -- حقول المسوقين والموظفين المالية
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (base_salary >= 0),
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    monthly_target NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (monthly_target >= 0),
    
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- الفهارس الخاصة بجدول المستخدمين
CREATE INDEX IF NOT EXISTS idx_users_entity_id ON users(entity_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(lower(email));

-- ------------------------------------------------------------------------------
-- 4. جدول الجمعيات الخيرية (Associations)
-- الجمعيات المستفيدة، الموقع، حالة التفعيل، المسؤول المعتمد
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    name TEXT NOT NULL CHECK (length(trim(name)) >= 3),
    short_name TEXT,
    code TEXT NOT NULL UNIQUE, -- رمز الجمعية مثل ASSOC-01
    license_number TEXT NOT NULL, -- رقم الترخيص الرسمي الصادر من المركز الوطني
    category TEXT NOT NULL DEFAULT 'رعاية أيتام وإغاثة', -- تصنيف الجمعية
    city TEXT NOT NULL,
    address TEXT,
    
    -- بيانات مسؤول التواصل المعتمد
    contact_person TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    
    -- الإعدادات المالية والاتفاقية
    contract_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    contract_end_date DATE,
    agreement_commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (agreement_commission_rate >= 0 AND agreement_commission_rate <= 100),
    bank_name TEXT,
    bank_iban TEXT,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس الجمعيات
CREATE INDEX IF NOT EXISTS idx_associations_entity_id ON associations(entity_id);
CREATE INDEX IF NOT EXISTS idx_associations_status ON associations(status);
CREATE INDEX IF NOT EXISTS idx_associations_city ON associations(city);
CREATE INDEX IF NOT EXISTS idx_associations_code ON associations(code);

-- ------------------------------------------------------------------------------
-- 5. جدول التراخيص النظامية (Licenses)
-- تراخيص الجمعيات، تراخيص الحملات، تواريخ البداية والانتهاء، التنبيهات
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id UUID NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    license_type TEXT NOT NULL CHECK (license_type IN (
        'establishment_license',   -- ترخيص التأسيس
        'fundraising_campaign',    -- ترخيص حملة جمع تبرعات
        'commercial_marketing',    -- ترخيص التسويق التجاري
        'collection_box',          -- ترخيص الحصالة / الصناديق
        'bank_account_license'     -- موافقة فتح حساب بنكي رسمي
    )),
    license_number TEXT NOT NULL,
    issuing_authority TEXT NOT NULL DEFAULT 'المركز الوطني لتنمية القطاع غير الربحي',
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL CHECK (expiry_date >= issue_date),
    
    -- حالة التنبيه الذكية: ساري، قارب على الانتهاء (أقل من 30 يوم)، منتهي، مجدد
    alert_status TEXT NOT NULL DEFAULT 'valid' CHECK (alert_status IN ('valid', 'expiring_soon', 'expired', 'renewed')),
    
    attachment_url TEXT, -- ملف الترخيص المرفق PDF أو صورة
    attachment_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس التراخيص
CREATE INDEX IF NOT EXISTS idx_licenses_association_id ON licenses(association_id);
CREATE INDEX IF NOT EXISTS idx_licenses_entity_id ON licenses(entity_id);
CREATE INDEX IF NOT EXISTS idx_licenses_expiry_date ON licenses(expiry_date);
CREATE INDEX IF NOT EXISTS idx_licenses_alert_status ON licenses(alert_status);

-- ------------------------------------------------------------------------------
-- 6. جدول مركز الطلبات (Requests)
-- الرقم المرجعي التلقائي REQ-2026-XXXX، الحالات الأربع، الربط بالجمعية والمسوق
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- رقم الطلب المرجعي التلقائي بتنسيق REQ-2026-XXXX
    reference_number TEXT NOT NULL UNIQUE DEFAULT ('REQ-2026-' || LPAD(nextval('seq_requests_2026')::TEXT, 4, '0')),
    request_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    association_id UUID NOT NULL REFERENCES associations(id) ON DELETE RESTRICT,
    marketer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    supervisor_id UUID REFERENCES users(id) ON DELETE SET NULL, -- المشرف المتابع
    
    title TEXT NOT NULL CHECK (length(trim(title)) >= 4),
    category TEXT NOT NULL CHECK (category IN (
        'donation_bonds',       -- تسليم سندات تبرع
        'marketing_campaign',   -- تدشين حملة تسويقية
        'field_collection',     -- تحصيل ميداني
        'license_renewal',      -- متابعة تجديد ترخيص
        'urgent_aid_support'    -- دعم مالي عاجل
    )),
    
    -- الحالات الأربع المحددة بدقة
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN (
        'in_progress',          -- قيد التنفيذ
        'awaiting_supervisor',  -- بانتظار المشرف
        'completed',            -- مكتمل
        'closed'                -- مغلق
    )),
    
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    reminder_number INT NOT NULL DEFAULT 0 CHECK (reminder_number >= 0), -- رقم/عداد التذكير
    last_reminder_at TIMESTAMPTZ,
    
    target_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (target_amount >= 0),
    total_bonds_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_bonds_amount >= 0),
    bonds_count INT NOT NULL DEFAULT 0 CHECK (bonds_count >= 0),
    
    notes TEXT,
    completed_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس مركز الطلبات
CREATE INDEX IF NOT EXISTS idx_requests_entity_id ON requests(entity_id);
CREATE INDEX IF NOT EXISTS idx_requests_association_id ON requests(association_id);
CREATE INDEX IF NOT EXISTS idx_requests_marketer_id ON requests(marketer_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON requests(priority);
CREATE INDEX IF NOT EXISTS idx_requests_reference_number ON requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_requests_date ON requests(request_date DESC);
CREATE INDEX IF NOT EXISTS idx_requests_compound ON requests(entity_id, status, request_date DESC);

-- ------------------------------------------------------------------------------
-- 7. جدول سندات التبرعات (Donation Bonds)
-- المبالغ، إرفاق السندات والأرشفة، تاريخ الرفع، الربط المباشر بالطلب
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donation_bonds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_number TEXT NOT NULL UNIQUE DEFAULT ('BND-2026-' || LPAD(nextval('seq_donation_bonds_2026')::TEXT, 4, '0')),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    association_id UUID NOT NULL REFERENCES associations(id) ON DELETE RESTRICT,
    marketer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    
    -- تفاصيل المتبرع وطريقة الدفع
    donor_name TEXT NOT NULL DEFAULT 'فاعل خير',
    donor_phone TEXT,
    donor_type TEXT NOT NULL DEFAULT 'individual' CHECK (donor_type IN ('individual', 'corporate', 'anonymous')),
    payment_method TEXT NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN (
        'bank_transfer', 'mada', 'apple_pay', 'visa', 'mastercard', 'stc_pay', 'cash', 'pos_terminal'
    )),
    payment_reference TEXT, -- الرقم المرجعي للتحويل أو إيصال نقطة البيع
    
    -- بيانات ملف السند المرفق (Archiving & File Storage)
    file_url TEXT NOT NULL,       -- رابط الملف في التخزين السحابي / Storage
    file_name TEXT NOT NULL,      -- اسم الملف الأصلي
    file_type TEXT NOT NULL,      -- نوع الملف (image/jpeg, image/png, application/pdf)
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    upload_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- حالة تدقيق ومطابقة السند
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN (
        'pending',     -- بانتظار التدقيق المحاسبي
        'verified',    -- مطابق ومعتمد
        'rejected'     -- مرفوض / غير مطابق
    )),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس سندات التبرع
CREATE INDEX IF NOT EXISTS idx_donation_bonds_request_id ON donation_bonds(request_id);
CREATE INDEX IF NOT EXISTS idx_donation_bonds_association_id ON donation_bonds(association_id);
CREATE INDEX IF NOT EXISTS idx_donation_bonds_marketer_id ON donation_bonds(marketer_id);
CREATE INDEX IF NOT EXISTS idx_donation_bonds_upload_date ON donation_bonds(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_donation_bonds_verification ON donation_bonds(verification_status);

-- ------------------------------------------------------------------------------
-- 8. جدول العمولات ومسير الرواتب (Commissions & Payroll)
-- احتساب عمولة المسوق بناءً على الطلبات المكتملة والسندات المعتمدة
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INT NOT NULL CHECK (period_year >= 2026),
    marketer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE RESTRICT,
    
    -- إحصائيات الإنجاز المرتبطة بالطلبات المكتملة
    completed_requests_count INT NOT NULL DEFAULT 0 CHECK (completed_requests_count >= 0),
    total_verified_donations NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_verified_donations >= 0),
    monthly_target NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (monthly_target >= 0),
    achievement_rate NUMERIC(6, 2) NOT NULL DEFAULT 0.00, -- نسبة التحقيق المئوية
    
    -- المكونات المالية للراتب والعمولة
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (base_salary >= 0),
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    commission_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (commission_amount >= 0),
    tier_bonus NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (tier_bonus >= 0), -- مكافأة تجاوز الهدف
    deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (deductions >= 0),   -- استقطاعات / خصومات
    
    -- صافي المستحق المالي = الراتب الأساسي + العمولة + المكافأة - الاستقطاعات
    net_payable NUMERIC(12, 2) GENERATED ALWAYS AS (
        base_salary + commission_amount + tier_bonus - deductions
    ) STORED,
    
    -- دورة حياة اعتماد وصرف العمولة
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',       -- مسودة تحت الاحتساب
        'reviewed',    -- مراجعة من مدير المبيعات
        'approved',    -- معتمدة من الإدارة المالية
        'paid'         -- تم الصرف والحوالة البنكية
    )),
    
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    paid_at TIMESTAMPTZ,
    payment_reference TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- منع تكرار مسير الشهر للمسوق الواحد في نفس الجهة
    CONSTRAINT uq_marketer_monthly_commission UNIQUE (period_year, period_month, marketer_id)
);

-- فهارس العمولات
CREATE INDEX IF NOT EXISTS idx_commissions_period ON commissions(period_year, period_month);
CREATE INDEX IF NOT EXISTS idx_commissions_marketer_id ON commissions(marketer_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);

-- ------------------------------------------------------------------------------
-- 9. جدول الربط بين العمولات والطلبات المكتملة (Commission Request Items)
-- لضمان التدقيق الكامل لأي طلب دخل ضمن احتساب عمولة معينة
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commission_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE RESTRICT,
    bonds_total_amount NUMERIC(14, 2) NOT NULL CHECK (bonds_total_amount >= 0),
    commission_earned NUMERIC(12, 2) NOT NULL CHECK (commission_earned >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_commission_request UNIQUE (commission_id, request_id)
);

CREATE INDEX IF NOT EXISTS idx_comm_req_items_commission_id ON commission_request_items(commission_id);
CREATE INDEX IF NOT EXISTS idx_comm_req_items_request_id ON commission_request_items(request_id);

-- ------------------------------------------------------------------------------
-- 10. جدول سجل العمليات والرقابة (Operation Logs)
-- يسجل بدقة: المستخدم، الحركة، الكيان المتأثر، الوقت، وتفاصيل التغييرات (Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS operation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES contract_entities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    
    -- نوع الحركة
    action TEXT NOT NULL CHECK (action IN (
        'LOGIN',               -- تسجيل دخول
        'CREATE',              -- إنشاء سجل جديد
        'UPDATE',              -- تعديل بيانات
        'DELETE',              -- حذف سجل
        'STATUS_CHANGE',       -- تغيير حالة طلب أو سند
        'VERIFY_BOND',         -- مطابقة سند مالي
        'REJECT_BOND',         -- رفض سند مالي
        'REMINDER_SENT',       -- إرسال تذكير بطلب
        'COMMISSION_CALC',     -- احتساب عمولة
        'PAYROLL_APPROVED',    -- اعتماد مسير الرواتب
        'PAYROLL_PAID',        -- تسجيل صرف الرواتب
        'FILE_UPLOAD',         -- رفع مستند أو سند
        'DATA_EXPORT'          -- تصدير بيانات وتقارير
    )),
    
    -- الكيان المتأثر
    affected_entity TEXT NOT NULL CHECK (affected_entity IN (
        'requests',
        'donation_bonds',
        'associations',
        'licenses',
        'users',
        'commissions',
        'contract_entities'
    )),
    affected_record_id UUID,
    
    -- وصف مقروء للحركة باللغة العربية
    description TEXT NOT NULL,
    
    -- التغييرات التقنية المسجلة بصيغة JSONB (القيم القديمة مقابل الجديدة)
    payload_diff JSONB,
    
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- فهارس سجل العمليات
CREATE INDEX IF NOT EXISTS idx_operation_logs_entity_id ON operation_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_action ON operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_operation_logs_affected_entity ON operation_logs(affected_entity);
CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 11. دوال وتريجرات التحديث التلقائي (Triggers & Functions)
-- ------------------------------------------------------------------------------

-- دالة تحديث حقل updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق التريجر على الجداول
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_associations_updated_at BEFORE UPDATE ON associations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_donation_bonds_updated_at BEFORE UPDATE ON donation_bonds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_licenses_updated_at BEFORE UPDATE ON licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة وتريجر لتحديث مجاميع السندات في جدول الطلب تلقائياً عند إضافة أو حذف سند
CREATE OR REPLACE FUNCTION sync_request_bonds_summary()
RETURNS TRIGGER AS $$
DECLARE
    target_req_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_req_id := OLD.request_id;
    ELSE
        target_req_id := NEW.request_id;
    END IF;

    UPDATE requests
    SET 
        total_bonds_amount = COALESPECS.total_sum,
        bonds_count = COALESPECS.total_count
    FROM (
        SELECT 
            COALESCE(SUM(amount), 0.00) AS total_sum,
            COUNT(*) AS total_count
        FROM donation_bonds
        WHERE request_id = target_req_id
    ) AS COALESPECS
    WHERE requests.id = target_req_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_request_bonds_summary
AFTER INSERT OR UPDATE OR DELETE ON donation_bonds
FOR EACH ROW EXECUTE FUNCTION sync_request_bonds_summary();

-- ------------------------------------------------------------------------------
-- 12. تفعيل سياسات الأمان على مستوى الصفوف (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE contract_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;

-- أمثلة سياسات الأمان:
-- 1. الأدمن ومدير المبيعات يطلعان على بيانات الجهة التابعة لهما بالكامل
CREATE POLICY admin_sales_manager_full_requests ON requests
FOR ALL TO authenticated
USING (
    (SELECT role FROM users WHERE users.id = auth.uid()) IN ('admin', 'sales_manager')
    AND entity_id = (SELECT entity_id FROM users WHERE users.id = auth.uid())
);

-- 2. المسوق يرى فقط طلباته الميدانية وسنداته المرفوعة
CREATE POLICY marketer_view_own_requests ON requests
FOR SELECT TO authenticated
USING (
    marketer_id = auth.uid()
);

CREATE POLICY marketer_view_own_bonds ON donation_bonds
FOR SELECT TO authenticated
USING (
    marketer_id = auth.uid()
);

-- 3. المحاسب يرى الطلبات والسندات للتدقيق المالي
CREATE POLICY accountant_view_all_bonds ON donation_bonds
FOR SELECT TO authenticated
USING (
    (SELECT role FROM users WHERE users.id = auth.uid()) IN ('admin', 'accountant')
);
