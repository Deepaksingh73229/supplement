export const INGREDIENT_CATEGORIES = [
  'Vitamins',
  'Minerals',
  'Amino Acids',
  'Herbal Extracts',
  'Probiotics',
  'Enzymes',
  'Fatty Acids',
  'Antioxidants',
  'Prebiotics',
  'Adaptogens',
  'Nootropics',
  'Proteins',
  'Carbohydrates',
  'Other',
] as const;

export const PRODUCT_CATEGORIES = [
  'General Wellness',
  'Sports Nutrition',
  'Weight Management',
  'Immune Support',
  'Cognitive Health',
  'Sleep Support',
  'Digestive Health',
  'Joint & Bone',
  'Heart Health',
  'Energy & Vitality',
  'Beauty & Skin',
  'Hormonal Balance',
  'Detox & Cleanse',
  'Protein Supplement',
  'Pre-Workout',
  'Post-Workout',
  'Multivitamin',
  'Specialty',
] as const;

export const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', color: 'emerald' },
  { value: 'medium', label: 'Medium Risk', color: 'amber' },
  { value: 'high', label: 'High Risk', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'rose' },
] as const;

export const OBSERVATION_CATEGORIES = [
  { value: 'synergy', label: 'Synergy', icon: 'Zap' },
  { value: 'redundancy', label: 'Redundancy', icon: 'Copy' },
  { value: 'gap', label: 'Gap', icon: 'AlertCircle' },
  { value: 'safety', label: 'Safety', icon: 'Shield' },
  { value: 'efficacy', label: 'Efficacy', icon: 'TrendingUp' },
  { value: 'stability', label: 'Stability', icon: 'Clock' },
] as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/analyze', label: 'Analyze', icon: 'Microscope' },
  { href: '/search', label: 'Semantic Search', icon: 'Search' },
  { href: '/history', label: 'History', icon: 'History' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
] as const;
