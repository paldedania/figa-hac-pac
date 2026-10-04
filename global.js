/* Optional demonstration interactions. Each page's HTML renders without JavaScript. */
(() => {
  'use strict';
  const key = 'medremind-website-demo-v1';
  const defaults = {
    taken: [0], medicines: [],
    preferences: { textSize: 'standard', contrast: false, medicineReminders: true, appointmentReminders: true, sound: false }
  };
  let state = structuredClone(defaults);
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved === 'object') {
      if (Array.isArray(saved.taken)) state.taken = [...new Set(saved.taken.filter(n => Number.isInteger(n) && n >= 0 && n < 3))];
      if (Array.isArray(saved.medicines)) state.medicines = saved.medicines.filter(m => m && ['name', 'strength', 'dose', 'time', 'startDate', 'instructions'].every(k => typeof m[k] === 'string'));
      if (saved.preferences) state.preferences = { ...defaults.preferences, ...saved.preferences };
    }
  } catch { /* Use initial demonstration records when storage is unavailable. */ }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); return true; }
    catch { return false; }
  }
  function applyPreferences() {
    document.body.classList.toggle('large-text', state.preferences.textSize === 'large');
    document.body.classList.toggle('high-contrast', state.preferences.contrast === true);
  }
  applyPreferences();

  const formatTime = time => {
    const [hour, minute] = time.split(':').map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time;
    return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }
  const templateMedicines = [
    { name: 'Lisinopril', strength: '10 mg', dose: '1 tablet', time: '08:00', instructions: '1 tablet daily' },
    { name: 'Metformin', strength: '500 mg', dose: '1 tablet', time: '13:00', instructions: '1 tablet daily • With food' },
    { name: 'Atorvastatin', strength: '20 mg', dose: '1 tablet', time: '20:00', instructions: '1 tablet daily' }
  ];

  // Marking a dose changes only the demonstration record in this browser.
  function updateDoses() {
    document.querySelectorAll('[data-dose-card]').forEach(card => {
      const id = Number(card.dataset.doseCard);
      if (!state.taken.includes(id)) return;
      const status = card.querySelector('.dose-status strong');
      if (status) status.textContent = 'Taken';
      if (id !== 0) {
        const takenIcon = document.querySelector('[data-dose-card="0"] .dose-status .icon');
        const currentIcon = card.querySelector('.dose-status .icon');
        if (takenIcon && currentIcon) currentIcon.replaceWith(takenIcon.cloneNode(true));
      }
      const action = card.querySelector('[data-dose]');
      if (action) action.replaceWith(element('span', 'muted', 'Marked as taken'));
    });
    const count = state.taken.length;
    const progress = document.querySelector('#progress-count');
    if (progress) progress.textContent = `${count} of 3`;
    const remaining = document.querySelector('#remaining-count');
    if (remaining) remaining.textContent = count === 3 ? 'All scheduled medicines marked taken.' : `${3 - count} medicine${count === 2 ? '' : 's'} remaining today.`;
    const bar = document.querySelector('.progress-bars');
    if (bar) {
      bar.setAttribute('aria-valuenow', String(count));
      [...bar.children].forEach((part, i) => part.classList.toggle('complete', i < count));
    }
  }
  document.querySelectorAll('[data-dose]').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.dose);
      if (!state.taken.includes(id)) state.taken.push(id);
      const stored = save();
      updateDoses();
      const feedback = document.querySelector('#dose-feedback');
      feedback.textContent = stored ? 'Dose marked as taken in your demonstration record.' : 'Dose marked as taken for this page. Browser storage is unavailable.';
      feedback.tabIndex = -1;
      feedback.focus();
    });
  });
  updateDoses();

  const medicineForm = document.querySelector('#medicine-form');
  if (medicineForm) medicineForm.addEventListener('submit', event => {
    event.preventDefault();
    const medicine = Object.fromEntries(new FormData(medicineForm));
    for (const field of Object.keys(medicine)) medicine[field] = medicine[field].trim();
    const feedback = document.querySelector('#medicine-feedback');
    if (['name', 'strength', 'dose', 'time', 'startDate'].some(field => !medicine[field])) {
      feedback.textContent = 'Enter the medicine name, strength, dose, time and start date.';
      return;
    }
    state.medicines.push(medicine);
    if (save()) location.href = '../02-my-medicines/index.html';
    else {
      state.medicines.pop();
      feedback.textContent = 'The browser could not save this record. Enable local storage or open the site through a local server, then save again.';
    }
  });
  const medicineList = document.querySelector('#medicine-list');
  if (medicineList) {
    state.medicines.forEach(medicine => {
      const row = element('article', 'card medicine-row');
      const tile = element('span', 'art-tile');
      const image = document.createElement('img');
      image.src = '../01-today/assets/bottle.svg'; image.alt = ''; image.width = 64; image.height = 64;
      tile.append(image);
      const name = element('div', 'medicine-name');
      name.append(element('h3', '', medicine.name), element('p', '', `${medicine.strength} • ${medicine.dose}`));
      const schedule = element('div', 'medicine-schedule');
      schedule.append(element('p', 'muted', 'Daily schedule'), element('strong', '', formatTime(medicine.time)));
      const instructions = element('div', 'medicine-instructions');
      instructions.append(element('p', 'muted', 'Instructions'), element('p', '', medicine.instructions || 'No instructions recorded'));
      row.append(tile, name, schedule, instructions);
      medicineList.append(row);
    });
    document.querySelector('#medicine-count').textContent = `${3 + state.medicines.length} medicines`;
  }

  const reportDialog = document.querySelector('#report-dialog');
  if (reportDialog) document.querySelectorAll('[data-report]').forEach(button => {
    button.addEventListener('click', () => {
      const reports = [['Medicine review report', '2 October 2026'], ['Blood test report', '20 September 2026']];
      const [title, date] = reports[Number(button.dataset.report)];
      document.querySelector('#report-title').textContent = title;
      document.querySelector('#report-date').textContent = date;
      reportDialog.showModal();
    });
  });

  const preferencesForm = document.querySelector('#preferences-form');
  if (preferencesForm) {
    const contrast = document.querySelector('#contrast-toggle');
    function updateControls() {
      const selectedSize = state.preferences.textSize === 'large' ? 'large' : 'standard';
      preferencesForm.querySelector(`[name="textSize"][value="${selectedSize}"]`).checked = true;
      contrast.setAttribute('aria-pressed', String(state.preferences.contrast === true));
      contrast.textContent = state.preferences.contrast === true ? 'On' : 'Off';
      ['medicineReminders', 'appointmentReminders', 'sound'].forEach(name => {
        const input = preferencesForm.elements.namedItem(name);
        input.checked = state.preferences[name] === true;
        input.nextElementSibling.querySelector('[data-state]').textContent = input.checked ? 'On' : 'Off';
      });
    }
    updateControls();
    contrast.addEventListener('click', () => {
      state.preferences.contrast = !state.preferences.contrast;
      applyPreferences(); updateControls();
    });
    preferencesForm.addEventListener('change', () => {
      state.preferences.textSize = preferencesForm.elements.namedItem('textSize').value;
      ['medicineReminders', 'appointmentReminders', 'sound'].forEach(name => {
        const input = preferencesForm.elements.namedItem(name);
        state.preferences[name] = input.checked;
        input.nextElementSibling.querySelector('[data-state]').textContent = input.checked ? 'On' : 'Off';
      });
      applyPreferences();
    });
    preferencesForm.addEventListener('submit', event => {
      event.preventDefault();
      document.querySelector('#preferences-feedback').textContent = save()
        ? 'Preferences saved in this browser. Reminder settings are demonstration controls.'
        : 'Preferences applied for this page. Browser storage is unavailable.';
    });
  }

  const emergencyList = document.querySelector('#emergency-medicine-list');
  if (emergencyList) state.medicines.forEach(medicine => {
    const row = element('tr');
    const name = element('th', '', `${medicine.name} ${medicine.strength}`);
    name.scope = 'row';
    row.append(name, element('td', '', `${medicine.dose} • ${formatTime(medicine.time)}`), element('td', '', medicine.instructions || 'No instructions recorded'));
    emergencyList.append(row);
  });
  document.querySelector('#download-medicines')?.addEventListener('click', () => {
    const medicines = [...templateMedicines, ...state.medicines];
    const text = ['MedRemind demonstration medicine list', 'Eleanor Brooks', 'Fictional records. Not prescribing instructions.', '', ...medicines.map(m => `${m.name} ${m.strength}\n${m.dose} • ${formatTime(m.time)}\n${m.instructions || 'No instructions recorded'}\n`)].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'eleanor-brooks-demo-medicine-list.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
