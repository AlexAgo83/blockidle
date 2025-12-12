import { createInput } from '../atoms/input.js';

export function createFormField({
  id,
  labelKey,
  placeholder,
  placeholderKey,
  type = 'text',
  maxLength,
  className = ''
} = {}) {
  const label = document.createElement('label');
  if (labelKey) label.dataset.i18n = labelKey;
  if (id) label.htmlFor = id;

  const input = createInput({ id, placeholder, placeholderKey, type, maxLength });

  const wrapper = document.createElement('div');
  wrapper.className = ['form-field', className].filter(Boolean).join(' ');
  wrapper.append(label, input);

  return { wrapper, input, label };
}
