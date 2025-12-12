export function createSelectField({
  id,
  labelKey,
  options = [],
  className = ''
} = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = ['settings-option', className].filter(Boolean).join(' ');

  const label = document.createElement('span');
  if (labelKey) label.dataset.i18n = labelKey;

  const select = document.createElement('select');
  if (id) select.id = id;

  options.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    if (opt.labelKey) {
      optionEl.dataset.i18n = opt.labelKey;
    }
    if (opt.label) {
      optionEl.textContent = opt.label;
    }
    select.appendChild(optionEl);
  });

  wrapper.append(label, select);
  return { wrapper, select, label };
}
