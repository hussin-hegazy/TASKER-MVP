// document.getElementById('add-task-button').addEventListener('click', addTask);

// function addTask() {
//     const taskInput = document.getElementById('new-task-input');
//     const taskText = taskInput.value.trim();

//     if (taskText === '') return;

//     const taskList = document.getElementById('task-list');
//     const task = document.createElement('div');
//     task.classList.add('task');
//     task.textContent = taskText;

//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Delete';
//     deleteButton.addEventListener('click', () => task.remove());

//     task.appendChild(deleteButton);
//     taskList.appendChild(task);

//     taskInput.value = '';
// }



document.getElementById('add-task-button').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskPriority = document.getElementById('task-priority');
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const taskList = document.getElementById('task-list');
    const task = document.createElement('div');
    task.classList.add('task');
    task.classList.add(`priority-${taskPriority.value}`);

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    taskTextSpan.addEventListener('dblclick', () => editTask(taskTextSpan));
    task.appendChild(taskTextSpan);

    const completeCheckbox = document.createElement('input');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.addEventListener('change', () => {
        if (completeCheckbox.checked) {
            taskTextSpan.style.textDecoration = 'line-through';
        } else {
            taskTextSpan.style.textDecoration = 'none';
        }
    });
    task.appendChild(completeCheckbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            task.remove();
            saveTasks();
        }
    });
    task.appendChild(deleteButton);

    taskList.appendChild(task);
    saveTasks();

    taskInput.value = '';
}

function editTask(taskTextSpan) {
    const newText = prompt('Edit your task:', taskTextSpan.textContent);
    if (newText !== null) {
        taskTextSpan.textContent = newText.trim();
        saveTasks();
    }
}

function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    taskList.querySelectorAll('.task').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const taskPriority = Array.from(task.classList).find(cls => cls.startsWith('priority-')).split('-')[1];
        const completed = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, priority: taskPriority, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskInput = document.getElementById('new-task-input');
        const taskPriority = document.getElementById('task-priority');
        taskInput.value = task.text;
        taskPriority.value = task.priority;
        addTask();
        const taskList = document.getElementById('task-list');
        const lastTask = taskList.lastChild;
        lastTask.querySelector('input[type="checkbox"]').checked = task.completed;
        lastTask.querySelector('input[type="checkbox"]').dispatchEvent(new Event('change'));
    });
}

document.addEventListener('DOMContentLoaded', loadTasks);

