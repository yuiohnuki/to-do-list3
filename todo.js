// Set up date
const today = new Date();
const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
const dayNumber = today.getDate();
const monthName = today.toLocaleDateString('en-US', { month: 'long' });

document.getElementById('dayName').textContent = dayName;
document.getElementById('dayNumber').textContent = dayNumber;
document.getElementById('monthName').textContent = monthName;

// DOM references
const addBtn = document.getElementById('addBtn');
const newTask = document.getElementById('newTask');
const taskList = document.getElementById('taskList');
const progressFill = document.querySelector('.progress-fill');
const progressLabel = document.getElementById('progress-label');

// find all checkboxes and update how much is done
function updateProgress() {
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const total = checkboxes.length;
  const progressPercent = total === 0 ? 0 : Math.round((checked / total) * 100);
  progressFill.style.width = `${progressPercent}%`;
  progressLabel.textContent = `${checked} tasks done`;
}

// create a new task element
function createTaskElement(text) {
  const li = document.createElement('li');

  // create text side by side with checkbox
  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '8px';

  // add the checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) li.classList.add('completed');
    else li.classList.remove('completed');
    updateProgress();
  });

  // add the text
  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  left.appendChild(checkbox);
  left.appendChild(textSpan);

  // add the remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.title = 'Remove task';
  removeBtn.innerText = 'Remove';
  removeBtn.addEventListener('click', () => {
    li.remove();
    updateProgress();
  });

  // everything gets combined into <li> element
  left.appendChild(checkbox);
  left.appendChild(textSpan);
  li.appendChild(left);
  li.appendChild(removeBtn);

  return li;
}

// add button logic
addBtn.addEventListener('click', (e) => {
  e.preventDefault(); //prevents page reload
  const taskText = newTask.value.trim();
  if (taskText !== '') {
    const el = createTaskElement(taskText);
    taskList.appendChild(el);
    newTask.value = '';
    updateProgress();
  }
});

// Support pressing Enter in the input
newTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Initialize
updateProgress();

// Hourly commitment logic
const hourlyText = document.getElementById('hourlyText');
const startHourlyBtn = document.getElementById('startHourlyBtn');
const stopHourlyBtn = document.getElementById('stopHourlyBtn');
const hourlyStatus = document.getElementById('hourlyStatus');
let hourlyTimer = null;

function addHourlyTask() {
  const text = (hourlyText.value && hourlyText.value.trim()) || 'Hourly commitment';
  const li = createTaskElement(text + ' — ' + new Date().toLocaleTimeString());
  taskList.insertBefore(li, taskList.firstChild);
  updateProgress();
  // optional notification
  if (window.Notification && Notification.permission === 'granted') {
    new Notification('Hourly commitment', { body: text });
  }
}

startHourlyBtn.addEventListener('click', async () => {
  if (window.Notification && Notification.permission !== 'granted') {
    try { await Notification.requestPermission(); } catch (e) { /* ignore */ }
  }
  if (hourlyTimer) return;
  addHourlyTask();
  hourlyTimer = setInterval(addHourlyTask, 60 * 60 * 1000); // every hour
  startHourlyBtn.disabled = true;
  stopHourlyBtn.disabled = false;
  hourlyStatus.textContent = 'Running';
});

stopHourlyBtn.addEventListener('click', () => {
  if (!hourlyTimer) return;
  clearInterval(hourlyTimer);
  hourlyTimer = null;
  startHourlyBtn.disabled = false;
  stopHourlyBtn.disabled = true;
  hourlyStatus.textContent = 'Stopped';
});
