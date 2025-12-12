export function createModal({
  id,
  className = '',
  modalClassName = '',
  titleKey,
  subtitleKey,
  content = [],
  actions = []
} = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = ['modal-backdrop', className].filter(Boolean).join(' ');
  if (id) backdrop.id = id;

  const modal = document.createElement('div');
  modal.className = ['modal', modalClassName].filter(Boolean).join(' ');

  if (titleKey) {
    const title = document.createElement('h2');
    title.dataset.i18n = titleKey;
    modal.appendChild(title);
  }

  if (subtitleKey) {
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.dataset.i18n = subtitleKey;
    modal.appendChild(subtitle);
  }

  const body = document.createElement('div');
  body.className = 'modal-body';
  (Array.isArray(content) ? content : [content]).filter(Boolean).forEach((node) => {
    body.appendChild(node);
  });

  const actionsRow = document.createElement('div');
  actionsRow.className = 'modal-actions';
  (Array.isArray(actions) ? actions : [actions]).filter(Boolean).forEach((node) => {
    actionsRow.appendChild(node);
  });

  modal.append(body, actionsRow);
  backdrop.appendChild(modal);

  return { backdrop, modal, body, actions: actionsRow };
}
