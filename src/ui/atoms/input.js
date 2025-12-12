export function createInput({
  id,
  type = 'text',
  placeholder = '',
  placeholderKey,
  maxLength,
  className = '',
  value = ''
} = {}) {
  const input = document.createElement('input');
  if (id) input.id = id;
  input.type = type;
  if (maxLength) input.maxLength = maxLength;
  if (placeholderKey) {
    input.dataset.i18nPlaceholder = placeholderKey;
  } else if (placeholder) {
    input.placeholder = placeholder;
  }
  if (value) input.value = value;
  if (className) input.className = className;
  return input;
}
