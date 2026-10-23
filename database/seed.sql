-- ==============================================================================
-- بيانات أولية تجريبية - نظام بيت التمكين وفروعها (غزارة + معين)
-- Seed Data: Contract Entities, Users, Associations, Requests, Bonds, Licenses, Logs
-- ==============================================================================

-- 1. الجهات التعاقدية الثلاث
INSERT INTO contract_entities (id, code, name_ar, name_en, cr_number, tax_number, phone, email, city, address)
VALUES 
('11111111-1111-1111-1111-111111111111', 'BAYT_TAMKEEN', 'مؤسسة بيت التمكين للتسويق', 'Bayt Al-Tamkeen Marketing', '1010789456', '310123456700003', '0112345678', 'contact@tamkeen-mkt.sa', 'الرياض', 'طريق الملك فهد - حي العليا'),
('22222222-2222-2222-2222-222222222222', 'GHAZARA', 'شركة غزارة للتجارة والتسويق', 'Ghazara Trading & Marketing', '1010892341', '310987654300003', '0118765432', 'info@ghazara.sa', 'الرياض', 'حي الصحافة - مجمع الأعمال'),
('33333333-3333-3333-3333-333333333333', 'MOEEN', 'مؤسسة معين الرقمية التجارية', 'Moeen Digital Commercial', '1010654321', '310456789000003', '0126543210', 'info@moeen-digital.sa', 'جدة', 'طريق الأمير سلطان')
ON CONFLICT (code) DO NOTHING;

-- 2. المستخدمون مع الأدوار الأربعة (Admin, Sales Manager, Marketer, Accountant)
INSERT INTO users (id, entity_id, name, email, phone, role, base_salary, commission_rate, monthly_target, permissions)
VALUES 
-- مدير النظام (Admin)
('aaaa1111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'م. عبدالعزيز التميمي', 'admin@tamkeen-mkt.sa', '0501112233', 'admin', 15000.00, 0.00, 0.00, '{
    "can_view_all_requests": true, "can_create_request": true, "can_approve_request": true, 
    "can_upload_bond": true, "can_verify_bond": true, "can_manage_associations": true, 
    "can_manage_licenses": true, "can_calculate_commissions": true, "can_approve_payroll": true, 
    "can_view_operation_logs": true, "can_export_reports": true
}'::jsonb),

-- مدير المبيعات (Sales Manager)
('aaaa2222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'أ. سلطان المنصور', 'sales.mgr@ghazara.sa', '0552223344', 'sales_manager', 10000.00, 2.00, 500000.00, '{
    "can_view_all_requests": true, "can_create_request": true, "can_approve_request": true, 
    "can_upload_bond": false, "can_verify_bond": false, "can_manage_associations": true, 
    "can_manage_licenses": true, "can_calculate_commissions": true, "can_approve_payroll": false, 
    "can_view_operation_logs": true, "can_export_reports": true
}'::jsonb),

-- مسوق ميداني 1 (Marketer)
('aaaa3333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'أحمد منصور البارقي', 'ahmed.mkt@ghazara.sa', '0543334455', 'marketer', 5000.00, 6.00, 150000.00, '{
    "can_view_all_requests": false, "can_create_request": true, "can_approve_request": false, 
    "can_upload_bond": true, "can_verify_bond": false, "can_manage_associations": false, 
    "can_manage_licenses": false, "can_calculate_commissions": false, "can_approve_payroll": false, 
    "can_view_operation_logs": false, "can_export_reports": false
}'::jsonb),

-- مسوق ميداني 2 (Marketer)
('aaaa4444-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'سارة فهد القحطاني', 'sara.mkt@moeen-digital.sa', '0564445566', 'marketer', 5500.00, 6.50, 180000.00, '{
    "can_view_all_requests": false, "can_create_request": true, "can_approve_request": false, 
    "can_upload_bond": true, "can_verify_bond": false, "can_manage_associations": false, 
    "can_manage_licenses": false, "can_calculate_commissions": false, "can_approve_payroll": false, 
    "can_view_operation_logs": false, "can_export_reports": false
}'::jsonb),

-- المحاسب المالي (Accountant)
('aaaa5555-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'أ. خالد الدوسري', 'finance@tamkeen-mkt.sa', '0595556677', 'accountant', 9000.00, 0.00, 0.00, '{
    "can_view_all_requests": true, "can_create_request": false, "can_approve_request": false, 
    "can_upload_bond": false, "can_verify_bond": true, "can_manage_associations": false, 
    "can_manage_licenses": false, "can_calculate_commissions": true, "can_approve_payroll": true, 
    "can_view_operation_logs": true, "can_export_reports": true
}'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- 3. الجمعيات الخيرية الشريكة
INSERT INTO associations (id, entity_id, name, short_name, code, license_number, city, contact_person, contact_phone, contact_email, agreement_commission_rate)
VALUES 
('bbbb1111-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'جمعية إحسان لرعاية الأيتام', 'جمعية إحسان', 'ASSOC-01', '1042 / م.ع', 'الرياض', 'أ. عبدالله السليمان', '0501234567', 'info@ehsan-orphan.org.sa', 10.00),
('bbbb2222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'جمعية البر والخدمات الإنسانية', 'جمعية البر', 'ASSOC-02', '892 / م.ع', 'جدة', 'د. ناصر الغامدي', '0559876543', 'contact@birr-charity.sa', 8.50),
('bbbb3333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'جمعية إطعام وحفظ النعمة', 'جمعية إطعام', 'ASSOC-03', '650 / م.ع', 'الدمام', 'م. فيصل الخالدي', '0567788990', 'care@itaam-east.sa', 9.00)
ON CONFLICT (code) DO NOTHING;

-- 4. التراخيص النظامية وحالات التنبيه
INSERT INTO licenses (association_id, entity_id, license_type, license_number, issuing_authority, issue_date, expiry_date, alert_status)
VALUES 
('bbbb1111-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'fundraising_campaign', 'LIC-2026-9812', 'المركز الوطني لتنمية القطاع غير الربحي', '2026-01-01', '2026-12-31', 'valid'),
('bbbb2222-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'establishment_license', 'LIC-EST-892', 'وزارة الموارد البشرية والتنمية الاجتماعية', '2023-05-10', '2026-11-15', 'expiring_soon'),
('bbbb3333-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'commercial_marketing', 'LIC-MKT-334', 'المركز الوطني لتنمية القطاع غير الربحي', '2025-06-01', '2026-06-01', 'expired');

-- 5. مركز الطلبات الذكي (Requests) - حالات متنوعة
INSERT INTO requests (id, reference_number, request_date, entity_id, association_id, marketer_id, supervisor_id, title, category, status, priority, reminder_number, target_amount)
VALUES 
('cccc1111-0000-0000-0000-000000000001', 'REQ-2026-1001', '2026-10-10 09:30:00+03', '22222222-2222-2222-2222-222222222222', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa3333-0000-0000-0000-000000000003', 'aaaa2222-0000-0000-0000-000000000002', 'حملة كفالة أيتام الرياض - المرحلة الأولى', 'donation_bonds', 'completed', 'high', 0, 50000.00),
('cccc2222-0000-0000-0000-000000000002', 'REQ-2026-1002', '2026-10-12 11:15:00+03', '22222222-2222-2222-2222-222222222222', 'bbbb2222-0000-0000-0000-000000000002', 'aaaa3333-0000-0000-0000-000000000003', 'aaaa2222-0000-0000-0000-000000000002', 'دعم الحالات الطبية الحرجة بالمنطقة الغربية', 'donation_bonds', 'awaiting_supervisor', 'urgent', 2, 30000.00),
('cccc3333-0000-0000-0000-000000000003', 'REQ-2026-1003', '2026-10-14 14:00:00+03', '33333333-3333-3333-3333-333333333333', 'bbbb3333-0000-0000-0000-000000000003', 'aaaa4444-0000-0000-0000-000000000004', NULL, 'مشروع إطعام 1000 أسرة بالمنطقة الشرقية', 'field_collection', 'in_progress', 'medium', 1, 40000.00),
('cccc4444-0000-0000-0000-000000000004', 'REQ-2026-1004', '2026-09-20 10:00:00+03', '22222222-2222-2222-2222-222222222222', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa3333-0000-0000-0000-000000000003', 'aaaa2222-0000-0000-0000-000000000002', 'حملة الحقيبة المدرسية للأيتام', 'donation_bonds', 'closed', 'low', 0, 25000.00)
ON CONFLICT (reference_number) DO NOTHING;

-- 6. سندات التبرعات والمرفقات (Donation Bonds) المرتبطة بالطلبات
INSERT INTO donation_bonds (request_id, association_id, marketer_id, entity_id, amount, donor_name, donor_phone, donor_type, payment_method, payment_reference, file_url, file_name, file_type, file_size_bytes, verification_status, verified_by, verified_at)
VALUES 
('cccc1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa3333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 20000.00, 'الشيخ سليمان الصالح', '0505112233', 'individual', 'bank_transfer', 'TRX-RAJ-994102', 'https://storage.tamkeen-mkt.sa/bonds/bond_1001.pdf', 'bond_1001.pdf', 'application/pdf', 245000, 'verified', 'aaaa5555-0000-0000-0000-000000000005', '2026-10-11 11:00:00+03'),
('cccc1111-0000-0000-0000-000000000001', 'bbbb1111-0000-0000-0000-000000000001', 'aaaa3333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 30000.00, 'شركة المدى القابضة', '0112233445', 'corporate', 'bank_transfer', 'TRX-NCB-887412', 'https://storage.tamkeen-mkt.sa/bonds/bond_1002.jpg', 'bond_1002.jpg', 'image/jpeg', 512000, 'verified', 'aaaa5555-0000-0000-0000-000000000005', '2026-10-11 11:30:00+03'),
('cccc2222-0000-0000-0000-000000000002', 'bbbb2222-0000-0000-0000-000000000002', 'aaaa3333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 15000.00, 'فاعل خير', '0559988776', 'anonymous', 'apple_pay', 'APAY-2026-3391', 'https://storage.tamkeen-mkt.sa/bonds/bond_1003.png', 'bond_1003.png', 'image/png', 320000, 'pending', NULL, NULL);

-- 7. احتساب العمولات للشهر الجاري (10 / 2026)
INSERT INTO commissions (period_month, period_year, marketer_id, entity_id, completed_requests_count, total_verified_donations, monthly_target, achievement_rate, base_salary, commission_rate, commission_amount, tier_bonus, deductions, status, reviewed_by)
VALUES 
(10, 2026, 'aaaa3333-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 1, 50000.00, 150000.00, 33.33, 5000.00, 6.00, 3000.00, 0.00, 0.00, 'reviewed', 'aaaa2222-0000-0000-0000-000000000002')
ON CONFLICT (period_year, period_month, marketer_id) DO NOTHING;

-- 8. سجل العمليات والرقابة (Operation Logs)
INSERT INTO operation_logs (entity_id, user_id, user_name, user_role, action, affected_entity, affected_record_id, description, payload_diff)
VALUES 
('22222222-2222-2222-2222-222222222222', 'aaaa3333-0000-0000-0000-000000000003', 'أحمد منصور البارقي', 'marketer', 'CREATE', 'requests', 'cccc1111-0000-0000-0000-000000000001', 'تم إنشاء طلب جديد برقم REQ-2026-1001 لكفالة الأيتام', '{"reference_number": "REQ-2026-1001", "target_amount": 50000}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'aaaa3333-0000-0000-0000-000000000003', 'أحمد منصور البارقي', 'marketer', 'FILE_UPLOAD', 'donation_bonds', 'cccc1111-0000-0000-0000-000000000001', 'تم رفع سند تبرع بقيمة 20,000 ريال مرفق به إشعار التحويل البنكي', '{"amount": 20000, "donor": "سليمان الصالح"}'::jsonb),
('11111111-1111-1111-1111-111111111111', 'aaaa5555-0000-0000-0000-000000000005', 'أ. خالد الدوسري', 'accountant', 'VERIFY_BOND', 'donation_bonds', 'cccc1111-0000-0000-0000-000000000001', 'تمت مطابقة وتأكيد السند المالي بنجاح بعد مراجعة كشف حساب البنك', '{"status": "verified"}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'aaaa2222-0000-0000-0000-000000000002', 'أ. سلطان المنصور', 'sales_manager', 'STATUS_CHANGE', 'requests', 'cccc1111-0000-0000-0000-000000000001', 'تغيير حالة الطلب REQ-2026-1001 إلى مكتمل بعد استيفاء المستهدف وتوثيق السندات', '{"from": "in_progress", "to": "completed"}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'aaaa3333-0000-0000-0000-000000000003', 'أحمد منصور البارقي', 'marketer', 'REMINDER_SENT', 'requests', 'cccc2222-0000-0000-0000-000000000002', 'إرسال تذكير للمشرف رقم 2 بخصوص الطلب REQ-2026-1002 (دعم الحالات الطبية)', '{"reminder_number": 2}'::jsonb);
