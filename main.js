'use strict';

/*jshint esversion: 11 */

const input = document.querySelector('input'),
	addButton = document.querySelector('button'),
	form = document.querySelector('form'),
	tasksList = document.querySelector('ul');

let tasksArray = [];

function createTask(taskText) {
	return { taskText: taskText, done: false, index: tasksArray.length };
}

function renderTasks() {
	tasksArray.forEach(taskToRender => {
		let taskElement = document.createElement('li'),
			taskTextElement = document.createElement('span'),
			btnGroup = document.createElement('div'),
			deleteButton = document.createElement('button'),
			doneButton = document.createElement('button');

		taskElement.classList.add(
			'list-group-item',
			'd-flex',
			'justify-content-between',
			'align-items-center'
		);

		btnGroup.classList.add('btn-group');
		deleteButton.classList.add('btn', 'btn-danger');
		doneButton.classList.add('btn', 'btn-success');
		taskTextElement.classList.add('task-text');

		taskTextElement.textContent = taskToRender.taskText;
		deleteButton.textContent = 'Delete';
		doneButton.textContent = 'Done';

		if (taskToRender.done) {
			taskTextElement.classList.add('line-through');
			taskElement.classList.add('done');
		}

		deleteButton.addEventListener('click', () => {
			taskElement.remove();
			tasksArray.forEach((task, index) => {
				if (taskToRender.index === task.index) {
					tasksArray.splice(index, 1);
				}
				updateLocalStorage();
			});
		});

		doneButton.addEventListener('click', () => {
			taskElement.classList.toggle('done');
			taskElement.firstElementChild.classList.toggle('line-through');
			taskToRender.done = !taskToRender.done;
			updateLocalStorage();
		});

		btnGroup.append(doneButton, deleteButton);
		taskElement.append(taskTextElement, btnGroup);

		tasksList.prepend(taskElement);
	});
}

function updateLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function getTasksFromLocalStorage() {
	tasksArray = JSON.parse(localStorage.getItem('tasks')) ?? [];
}

function clearTasksList() {
	while (tasksList.firstChild) {
		tasksList.removeChild(tasksList.firstChild);
	}
}

form.addEventListener('submit', e => {
	e.preventDefault();
	if (!input.value.length) {
		return;
	}
	tasksArray.push(createTask(input.value));
	clearTasksList();
	renderTasks();
	updateLocalStorage();
	form.reset();
});

// Input emptiness check
input.addEventListener('input', () => {
	if (!!input.value.length) {
		addButton.disabled = false;
	} else {
		addButton.disabled = true;
	}
});

getTasksFromLocalStorage();
if (tasksArray.length) {
	renderTasks();
}
