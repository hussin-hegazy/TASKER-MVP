document.getElementById('add-task-button').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskPriority = document.getElementById('task-priority');
    const taskText = taskInput.value.trim();

    if (taskText === '') return; // Avoid adding empty tasks

    const taskList = document.getElementById('task-list');
    const task = document.createElement('div');
    task.classList.add('task');
    task.classList.add(`priority-${taskPriority.value}`);

    // Create task content
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    taskTextSpan.addEventListener('dblclick', () => editTask(taskTextSpan));
    taskContent.appendChild(taskTextSpan);
    task.appendChild(taskContent);

    // Create status buttons
    const statusButtons = document.createElement('div');
    statusButtons.classList.add('status-buttons');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-btn');
    completeButton.addEventListener('click', () => toggleTaskStatus(task, 'completed'));
    statusButtons.appendChild(completeButton);

    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.classList.add('continue-btn');
    continueButton.addEventListener('click', () => toggleTaskStatus(task, 'continued'));
    statusButtons.appendChild(continueButton);

    const failButton = document.createElement('button');
    failButton.textContent = 'Fail';
    failButton.classList.add('fail-btn');
    failButton.addEventListener('click', () => toggleTaskStatus(task, 'failed'));
    statusButtons.appendChild(failButton);

    task.appendChild(statusButtons);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✘';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            task.remove();
            saveTasks();
        }
    });
    task.appendChild(deleteButton);

    taskList.appendChild(task);
    sortTasks();
    saveTasks();

    taskInput.value = ''; // Clear input field
}

function editTask(taskTextSpan) {
    const newText = prompt('Edit your task:', taskTextSpan.textContent);
    if (newText !== null) {
        taskTextSpan.textContent = newText.trim();
        saveTasks();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`; // Add class based on notification type
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000); // Remove notification after 3 seconds
}

function toggleTaskStatus(task, newStatus) {
    const statusButtons = task.querySelector('.status-buttons');
    
    // Remove current status
    task.classList.remove('completed', 'continued', 'failed');
    task.style.backgroundColor = ''; // Reset background color
    task.style.opacity = '1'; // Reset opacity

    // Apply new status
    switch (newStatus) {
        case 'completed':
            task.classList.add('completed');
            task.style.opacity = '0.6';
            showCelebration();
            break;
        case 'continued':
            task.style.backgroundColor = 'orange';
            task.style.opacity = '0.6';
            showNotification('Keep going, succeed.', 'continued');
            break;
        case 'failed':
            task.style.backgroundColor = 'red';
            task.style.opacity = '0.6';
            showNotification('Success is one step beyond failure.', 'error');
            break;
    }

    // Disable current status button
    statusButtons.querySelectorAll('button').forEach(button => button.disabled = false);
    statusButtons.querySelector(`.${newStatus}-btn`).disabled = true;

    saveTasks();
}

function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.innerHTML = 
        `<div class="fireworks"></div>` +
        [...Array(30)].map((_, i) => 
            `<div class="confetti" style="left: ${Math.random() * 100}%; background-color: ${['red', 'yellow', 'green'][Math.floor(Math.random() * 3)]}; animation-delay: ${Math.random() * 2}s;"></div>`
        ).join('');
    celebration.style.display = 'block';
    showNotification('Congratulations! Task completed successfully.', 'completed');
    setTimeout(() => celebration.style.display = 'none', 3000); // Hide celebration after 3 seconds
}

function sortTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.querySelectorAll('.task'));
    tasks.sort((a, b) => {
        const priorityA = Array.from(a.classList).find(cls => cls.startsWith('priority-')).split('-')[1];
        const priorityB = Array.from(b.classList).find(cls => cls.startsWith('priority-')).split('-')[1];
        return ['high', 'medium', 'low'].indexOf(priorityA) - ['high', 'medium', 'low'].indexOf(priorityB);
    });
    tasks.forEach(task => taskList.appendChild(task));
}

function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    taskList.querySelectorAll('.task').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const taskPriority = Array.from(task.classList).find(cls => cls.startsWith('priority-')).split('-')[1];
        const status = Array.from(task.classList).find(cls => cls !== 'task' && cls !== 'completed' && cls !== 'continued' && cls !== 'failed') || null;
        tasks.push({ text: taskText, priority: taskPriority, status });
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
        if (task.status) {
            toggleTaskStatus(lastTask, task.status);
        }
    });
    sortTasks();
}

document.addEventListener('DOMContentLoaded', loadTasks);
