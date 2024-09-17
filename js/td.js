const createButton = document.querySelector(".create-buttn");
const input = document.querySelector(".title-input");
const inputText = document.querySelector(".textarea");
const task_list = document.querySelector(".tasks");
const formСreater = document.querySelector(".form-creater");
let isEdit = false;
let currentEdit = 0;
let perentNoteGlobal = {};
const tasks = [];


if (localStorage.getItem('tasks')) {
  tasks.push(...JSON.parse(localStorage.getItem('tasks')))
  tasks.forEach((task) => randerTask(task))
}
checkEmpty()

createButton.addEventListener('click', () => {
  console.log(input.value.trim().length);
  if (!input.value.trim()) {input.focus(); return;};
  console.log(input.value.trim().length);
  if (!inputText.value.trim()) {inputText.focus(); return;};
  addTask();
})


task_list.addEventListener('click', (event) => {
  switch (event.target.dataset.action){
    case ('delete'): 
      if (confirm("Are you Sure?")) deleteTask(event); 
      console.log('delete');
      break;
    case ('save'): 
      doneTask(event); 
      console.log('save');
      break;
    case ('edit'): 
      editTask(event); 
      console.log('edit');
      break;
  }
  checkEmpty()
  saveToLocalStorage()
});

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
  if (inputText.value.trim().length && input.value.trim().length) {
  addTask();
  };
  if (!input.value.trim()) input.focus();
  if (!inputText.value.trim()) inputText.focus();
};
});

inputText.addEventListener("keyup", function (event) {
  if (event.keyCode === 13 && event.ctrlKey)  {
    if (!input.value.trim()) {input.focus(); return};
    if (!inputText.value.trim()) {inputText.focus(); return};
    addTask()
};

});


function addTask() {
  if (!isEdit) {
    const newTask = {
      id: Date.now(),
      title: input.value,
      text: inputText.value,
      done: false,
      edit: false
    }
    tasks.push(newTask);
    randerTask(newTask);
  } else {
    editTaskDone()
  }
  input.value = "";
  inputText.value = "";
  input.focus();
  checkEmpty();
  saveToLocalStorage();
};

function editTaskDone() {
    const currentTask = findCurrentEl(tasks, currentEdit);
    if (!currentTask) return;
    currentTask.title = input.value;
    currentTask.text = inputText.value;
    formСreater.classList.remove('form-createrEdit');
    isEdit = false;
    perentNoteGlobal.querySelector('.task__inf-head').innerHTML = currentTask.title;
    perentNoteGlobal.querySelector('.task__inf-text').innerHTML = currentTask.text;
    currentEdit = 0;
}

function deleteTask(event) {
    const perentNote = event.target.closest('.task');
    const id = Number(perentNote.id);
    const index = tasks.findIndex((el) => el.id === id)
    tasks.splice(index, 1);
    perentNote.remove();
};

function doneTask(event) {
    const perentNote = event.target.closest('.task');
    const id = Number(perentNote.id);
    const task = findCurrentEl(tasks, id);
    task.done = !task.done
    perentNote.classList.toggle('task--done');
};

function editTask(event) {
  const perentNote = event.target.closest('.task');
  perentNoteGlobal = perentNote;
  const id = Number(perentNote.id);
  const task = findCurrentEl(tasks, id);
  formСreater.classList.add('form-createrEdit');
  isEdit = true;
  currentEdit = id;
  input.value = task.title;
  inputText.value = task.text;
  input.focus();
};

const findCurrentEl = (arr, id) => {
  return arr.find((el) => el.id === id);
}

function checkEmpty() {
  if (!tasks.length && !document.querySelector('.ampty')) {
    const emptylistHTML = `<li class="ampty">
        <p class="task--ampty">список дел пуст</p>
        </li>`
    task_list.insertAdjacentHTML("afterbegin", emptylistHTML);
  } else if (tasks.length) {
    const emptylistEl = document.querySelector('.ampty');
    emptylistEl ? emptylistEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function randerTask(task) {
  const cssClass = task.done ? "task task--done" : "task"
  const tastHTML = `
  <li id="${task.id}" class="${cssClass}">
    <ul class="task__inf">
      <li class="task__inf-head">${task.title}</li>
      <li class="task__inf-text">${task.text}</li>
    </ul>
    <div class="bottom-container">
      <button data-action="save" href="#" class=" save-buttn">
        Save
      </button>
      <button data-action ="edit" class=" edit-buttn">
        Edit
      </button>
      <button data-action ="delete" class=" del-buttn">
        Delete
      </button>
    </div>
  </li>`;
  task_list.insertAdjacentHTML("beforeend",
    tastHTML);
}