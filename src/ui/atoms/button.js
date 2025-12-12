export function createButton({
  id,
  label,
  labelKey,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false
} = {}) {
  const btn = document.createElement('button');
  if (id) btn.id = id;
  btn.type = type;
  btn.disabled = disabled;
  const classes = [
    'ui-btn',
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    fullWidth ? 'ui-btn-block' : '',
    className
  ];
  if (variant === 'ghost') {
    classes.push('ghost-btn');
  }
  if (variant === 'danger') {
    classes.push('danger-btn');
  }
  btn.className = classes.filter(Boolean).join(' ');
  if (labelKey) {
    btn.dataset.i18n = labelKey;
  }
  if (label) {
    btn.textContent = label;
  }
  return btn;
}
