export function createToggle({
  id,
  labelKey,
  className = '',
  checked = false
} = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = ['settings-option', className].filter(Boolean).join(' ');

  const input = document.createElement('input');
  input.type = 'checkbox';
  if (id) input.id = id;
  input.checked = Boolean(checked);

  const span = document.createElement('span');
  if (labelKey) {
    span.dataset.i18n = labelKey;
  }

  wrapper.append(input, span);

  return { wrapper, input, label: span };
}
