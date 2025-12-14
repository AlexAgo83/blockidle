import { createButton } from '../atoms/button.js';
import { createFormField } from '../molecules/form-field.js';
import { createToggle } from '../molecules/toggle.js';
import { createSelectField } from '../molecules/select-field.js';
import { createModal } from '../molecules/modal.js';

export function buildSettingsModal(root = document.body) {
  if (!root) return null;

  const existing = document.getElementById('settings-modal-backdrop');
  if (existing) existing.remove();

  const upField = createFormField({
    id: 'key-up',
    labelKey: 'settings.move_up',
    placeholder: 'e.g., ArrowUp or W',
    maxLength: 20
  });
  const downField = createFormField({
    id: 'key-down',
    labelKey: 'settings.move_down',
    placeholder: 'e.g., ArrowDown or S',
    maxLength: 20
  });
  const leftField = createFormField({
    id: 'key-left',
    labelKey: 'settings.move_left',
    placeholder: 'e.g., ArrowLeft or A',
    maxLength: 20
  });
  const rightField = createFormField({
    id: 'key-right',
    labelKey: 'settings.move_right',
    placeholder: 'e.g., ArrowRight or D',
    maxLength: 20
  });
  const launchField = createFormField({
    id: 'key-launch',
    labelKey: 'settings.launch_ball',
    placeholder: 'e.g., Space',
    maxLength: 20
  });

  const settingsGrid = document.createElement('div');
  settingsGrid.className = 'settings-grid';
  [
    leftField.wrapper,
    rightField.wrapper,
    upField.wrapper,
    downField.wrapper,
    launchField.wrapper
  ].forEach((node) => settingsGrid.appendChild(node));

  const damageToggle = createToggle({
    id: 'toggle-damage-graph',
    labelKey: 'settings.show_damage'
  });
  const fpsToggle = createToggle({
    id: 'toggle-fps',
    labelKey: 'settings.show_fps'
  });
  const paddleDebugToggle = createToggle({
    id: 'toggle-paddle-rect',
    labelKey: 'settings.show_paddle_rect'
  });
  const loadoutSidebarToggle = createToggle({
    id: 'toggle-loadout-sidebar',
    labelKey: 'settings.show_loadout_sidebar'
  });
  const autoPauseToggle = createToggle({
    id: 'toggle-auto-pause',
    labelKey: 'settings.auto_pause'
  });
  const languageField = createSelectField({
    id: 'language-select',
    labelKey: 'settings.language',
    options: [
      { value: 'en', labelKey: 'settings.lang_en', label: 'English' },
      { value: 'fr', labelKey: 'settings.lang_fr', label: 'Français' },
      { value: 'es', labelKey: 'settings.lang_es', label: 'Español' }
    ]
  });

  const cancelBtn = createButton({
    id: 'settings-cancel',
    labelKey: 'settings.cancel',
    variant: 'ghost'
  });
  const saveBtn = createButton({
    id: 'settings-save',
    labelKey: 'settings.save'
  });

  const modal = createModal({
    id: 'settings-modal-backdrop',
    modalClassName: 'settings-modal',
    titleKey: 'settings.title',
    subtitleKey: 'settings.subtitle',
    content: [
      settingsGrid,
      damageToggle.wrapper,
      fpsToggle.wrapper,
      paddleDebugToggle.wrapper,
      loadoutSidebarToggle.wrapper,
      autoPauseToggle.wrapper,
      languageField.wrapper
    ],
    actions: [cancelBtn, saveBtn]
  });

  root.appendChild(modal.backdrop);

  return {
    backdrop: modal.backdrop,
    leftInput: leftField.input,
    rightInput: rightField.input,
    upInput: upField.input,
    downInput: downField.input,
    launchInput: launchField.input,
    damageToggle: damageToggle.input,
    fpsToggle: fpsToggle.input,
    paddleDebugToggle: paddleDebugToggle.input,
    loadoutSidebarToggle: loadoutSidebarToggle.input,
    autoPauseToggle: autoPauseToggle.input,
    languageSelect: languageField.select,
    cancelBtn,
    saveBtn: saveBtn
  };
}
