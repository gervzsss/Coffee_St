export const CATEGORIES = [
  { value: 'hot-coffee', label: 'Hot Coffee' },
  { value: 'iced-coffee', label: 'Iced Coffee' },
  { value: 'frappe', label: 'Frappe' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'pastries', label: 'Pastries' },
  { value: 'cakes', label: 'Cakes' },
  { value: 'buns', label: 'Buns' },
];

export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find((cat) => cat.value === value);
  return category ? category.label : value?.replace('-', ' ') || '';
};
