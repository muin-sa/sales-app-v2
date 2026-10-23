// ==============================================================================
// البيانات التجريبية المتوافقة مع مخطط قاعدة البيانات وشاشات النظام
// Mock Data for Bayt Al-Tamkeen Sales Management System
// ==============================================================================

export interface RequestItem {
  id: string;
  reference_number: string;
  title: string;
  association_name: string;
  association_code: string;
  request_date: string;
  status: 'in_progress' | 'awaiting_supervisor' | 'closed' | 'completed' | 'stalled';
  status_label: string;
  category: string;
  tab_stage: 'all' | 'sales' | 'referred' | 'processing' | 'awaiting_association' | 'stalled' | 'completed';
  reminder_number: number;
  marketer_name: string;
  entity_name: string;
  target_amount: number;
  total_bonds_amount: number;
  bonds_count: number;
  notes?: string;
}

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: "req-004",
    reference_number: "REQ-2026-000004",
    title: "كشف ارامل",
    association_name: "صفينة",
    association_code: "ASSOC-SFN",
    request_date: "2026/08/27",
    status: "in_progress",
    status_label: "قيد التنفيذ",
    category: "كفالة أيتام وأرامل",
    tab_stage: "processing",
    reminder_number: 1,
    marketer_name: "أحمد منصور البارقي",
    entity_name: "شركة غزارة للتجارة والتسويق",
    target_amount: 50000,
    total_bonds_amount: 20000,
    bonds_count: 2,
    notes: "تم التواصل مع الجمعية بخصوص كشوفات الأرامل وجارٍ استكمال السندات الميدانية."
  },
  {
    id: "req-003",
    reference_number: "REQ-2026-000003",
    title: "كشف ايتام",
    association_name: "المحيصة",
    association_code: "ASSOC-MHS",
    request_date: "2026/08/27",
    status: "awaiting_supervisor",
    status_label: "بانتظار المشرف",
    category: "رعاية أيتام",
    tab_stage: "awaiting_association",
    reminder_number: 1,
    marketer_name: "أحمد منصور البارقي",
    entity_name: "شركة غزارة للتجارة والتسويق",
    target_amount: 35000,
    total_bonds_amount: 15000,
    bonds_count: 1,
    notes: "بانتظار توقيع مشرف المبيعات على ميزانية الحملة ومطابقة السند المحاسبي."
  },
  {
    id: "req-002",
    reference_number: "REQ-2026-000002",
    title: "كشف حالات",
    association_name: "صفينة",
    association_code: "ASSOC-SFN",
    request_date: "2026/08/27",
    status: "closed",
    status_label: "مغلق",
    category: "مساعدات طارئة",
    tab_stage: "referred",
    reminder_number: 0,
    marketer_name: "سارة فهد القحطاني",
    entity_name: "مؤسسة معين الرقمية التجارية",
    target_amount: 25000,
    total_bonds_amount: 25000,
    bonds_count: 3,
    notes: "تم إقفال الطلب بعد تحويل كامل المبالغ لحساب الجمعية وإصدار سندات القبض."
  },
  {
    id: "req-001",
    reference_number: "REQ-2026-000001",
    title: "كفالة أسر متعففة",
    association_name: "جمعية إحسان لرعاية الأيتام",
    association_code: "ASSOC-EHS",
    request_date: "2026/08/25",
    status: "completed",
    status_label: "مكتمل",
    category: "كفالة أسر",
    tab_stage: "completed",
    reminder_number: 0,
    marketer_name: "أحمد منصور البارقي",
    entity_name: "مؤسسة بيت التمكين للتسويق",
    target_amount: 80000,
    total_bonds_amount: 80000,
    bonds_count: 5,
    notes: "اكتمل جمع المستهدف بالكامل بنسبة 100% وتوثيق السندات المالية."
  },
  {
    id: "req-005",
    reference_number: "REQ-2026-000005",
    title: "مشروع إطعام وحفظ النعمة",
    association_name: "جمعية إطعام",
    association_code: "ASSOC-ITM",
    request_date: "2026/08/28",
    status: "in_progress",
    status_label: "قيد التنفيذ",
    category: "إطعام محتاجين",
    tab_stage: "sales",
    reminder_number: 2,
    marketer_name: "محمد العتيبي",
    entity_name: "مؤسسة بيت التمكين للتسويق",
    target_amount: 40000,
    total_bonds_amount: 10000,
    bonds_count: 1,
    notes: "جارٍ توثيق المتبرعين من القطاع التجاري والمؤسسي بالمنطقة الشرقية."
  },
  {
    id: "req-006",
    reference_number: "REQ-2026-000006",
    title: "ترميم منازل أسر محتاجة",
    association_name: "جمعية البر والخدمات الإنسانية",
    association_code: "ASSOC-BIRR",
    request_date: "2026/08/20",
    status: "stalled",
    status_label: "متعثّر",
    category: "إسكان وترميم",
    tab_stage: "stalled",
    reminder_number: 3,
    marketer_name: "سارة فهد القحطاني",
    entity_name: "مؤسسة معين الرقمية التجارية",
    target_amount: 100000,
    total_bonds_amount: 12000,
    bonds_count: 1,
    notes: "تعثر في تجديد تصريح جمع التبرعات من المركز الوطني، بانتظار إفادة الجمعية."
  }
];

export const ASSOCIATIONS_LIST = [
  { id: "assoc-1", name: "صفينة", code: "ASSOC-SFN" },
  { id: "assoc-2", name: "المحيصة", code: "ASSOC-MHS" },
  { id: "assoc-3", name: "جمعية إحسان لرعاية الأيتام", code: "ASSOC-EHS" },
  { id: "assoc-4", name: "جمعية إطعام وحفظ النعمة", code: "ASSOC-ITM" },
  { id: "assoc-5", name: "جمعية البر والخدمات الإنسانية", code: "ASSOC-BIRR" },
  { id: "assoc-6", name: "رفائع النجع", code: "ASSOC-RFN" },
  { id: "assoc-7", name: "ضريغط", code: "ASSOC-DRG" }
];
