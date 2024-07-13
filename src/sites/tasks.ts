import { Task } from '../models/Task';
import LocalStorageTaskCrud from '../operations/LocalStorageTaskCrud';
import LocalStorageStoryCrud from '../operations/LocalStorageStoryCrud';
import LocalStorageUserCrud from '../operations/LocalStorageUserCrud';
import { getActiveProjectId } from './main';

export function renderTask()
{
    return `
    <h1 class="text-3xl font-bold p-4 l-4 text-white dark:text-black">Zadania localstorage</h1>
    </div>
    <div class="p-4 m-2 w-1/3">
        <input id="taskName" placeholder="Nazwa" class="w-full rounded p-2 m-1 dark:bg-gray-700">
        <textarea id="taskDesc" placeholder="Opis" class="w-full rounded p-2 m-1 dark:bg-gray-700""></textarea>
        
        <label>Priorytet</label>
        <select id="taskPriority" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          <option value="low" selected>Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>

        <label>Historyjka</label>
        <select id="taskStory" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          ${getStoryOptions(1)}
        </select>

        <select id="taskUser" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          ${getUserOptions(1)}
        </select>

        <input id="taskPredTime" placeholder="Przewidywany czas w godzinach" class="w-full rounded p-2 m-1 dark:bg-gray-700">

        <button id="createButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded dark:text-black dark:bg-blue-900">Stwórz zadanie</button>
    </div>
    <div id="taskList" class="grid grid-cols-3 gap-4">
        <div id="todoList">
            <h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Nierozpoczęte</h1>
        </div>
        <div id="ongoingList">
            <h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">W trakcie</h1>
        </div>
        <div id="doneList">
            <h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Skończone</h1>
        </div>
    </div>
  `;
}

function renderTasks(task: Task, dateString: string)
{
    return `
    <div id="taskId" data-id="${task.id}" class="p-4 m-3 border-slate-600 rounded shadow-md hover:shadow-lg bg-blue-600 dark:bg-gray-800">
        <input id="nameInput" class="w-full rounded p-2 m-1 dark:bg-gray-700" value="${task.name}">
        <textarea id="descInput" class="w-full rounded p-2 m-1 dark:bg-gray-700">${task.description}</textarea>

        <label>Priorytet</label>
        <select id="priorityInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
            <option value="low" ${task.priority == 'low' ? 'selected' : ''}>Niski</option>
            <option value="medium" ${task.priority == 'medium' ? 'selected' : ''}>Średni</option>
            <option value="high" ${task.priority == 'high' ? 'selected' : ''}>Wysoki</option>
        </select>

        <label>Status</label>
        <select id="stateInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
            ${getTaskStates(task.state)}
        </select>

        <label>Historyjka</label>
        <select id="storyInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          ${getStoryOptions(task.storyId)}
        </select>

        <label>Przypisany użytkownik</label>
        <select id="userInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          ${getUserOptions(task.ownerId)}
        </select>

        ${dateString}

        <input id="taskPredTime" class="w-full rounded p-2 m-1 dark:bg-gray-700" value="${task.predictedTime}">

        <div class="flex justify-between mt-2">
            <button id="updateButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-blue-900">Aktualizuj</button>
            <button id="deleteButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-red-900">Usuń</button>
        </div>
    </div>
  `;
}

function updateTaskDiv(id: number, div: HTMLElement)
{
    try
    {
        const nameInput = div.querySelector('#nameInput') as HTMLInputElement;
        const descInput = div.querySelector('#descInput') as HTMLTextAreaElement;
        const priorityInput = div.querySelector('#priorityInput') as HTMLSelectElement;
        const stateInput = div.querySelector('#stateInput') as HTMLSelectElement;
        const storyInput = div.querySelector('#storyInput') as HTMLSelectElement;
        const userInput = div.querySelector('#userInput') as HTMLSelectElement;
        const timeInput = div.querySelector('#taskPredTime') as HTMLSelectElement;
        

        const newTask: Task = {
            projectId: getActiveProjectId(),
            id: id,
            name: nameInput.value,
            description: descInput.value,
            priority: priorityInput.value,
            state: stateInput.value,
            creationDate: new Date(),
            storyId: parseInt(storyInput.value),
            ownerId: parseInt(userInput.value),
            predictedTime: parseInt(timeInput.value)
        };

        if (newTask.state == "ongoing")
        {
            newTask.startDate = new Date;
        }
        else if (newTask.state == "done")
        {
            newTask.startDate = new Date;
            newTask.endDate = new Date;
        }

        LocalStorageTaskCrud.update(newTask);
        getTasks();
    }
    catch (error)
    {
        alert(error.message);
    }
}

function getTasks()
{
    const todoListDiv = document.getElementById('todoList');
    const ongoingListDiv = document.getElementById('ongoingList');
    const doneListDiv = document.getElementById('doneList');
    const tasks = LocalStorageTaskCrud.getProjectTasks(getActiveProjectId());

    todoListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Nierozpoczęte</h1>';
    ongoingListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">W trakcie</h1>';
    doneListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Skończone</h1>';

    tasks.forEach(function (task)
    {
        const formattedCreationDate = task.creationDate.toString().substring(0, 10);

        let formattedDate = `<p>Data utworzenia: ${formattedCreationDate}</p>`

        if (task.state == "done")
        {
            try
            {
                const formattedStartDate = task.startDate.toString().substring(0, 10);
                const formattedEndDate = task.endDate.toString().substring(0, 10);

                formattedDate += `<p> Data rozpoczęcia: ${formattedStartDate} </p><p> Data zakończnia: ${formattedEndDate} </p>`;
            }
            catch
            {

            }
        }
        else if (task.state == "ongoing")
        {
            try
            {
                const formattedStartDate = task.startDate.toString().substring(0, 10);

                formattedDate += `<p> Data rozpoczęcia: ${formattedStartDate} </p>`
            }
            catch
            {

            }
        }

        let elem = renderTasks(task, formattedDate);

        if (task.state == "todo")
        {
            todoListDiv.innerHTML += elem;
        }
        else if (task.state == "ongoing")
        {
            ongoingListDiv.innerHTML += elem;
        }
        else
        {
            doneListDiv.innerHTML += elem;
        }
    });

    document.querySelectorAll('#updateButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            const taskId = button.parentElement.parentElement.dataset.id;
            updateTaskDiv(parseInt(taskId), button.parentElement.parentElement);
        });
    });

    document.querySelectorAll('#deleteButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            const taskId = button.parentElement.parentElement.dataset.id;
            deleteTask(taskId);
        });
    });
}

function createTask()
{
    const nameInput = document.getElementById('taskName') as HTMLInputElement;
    const descInput = document.getElementById('taskDesc') as HTMLTextAreaElement;
    const priorityInput = document.getElementById('taskPriority') as HTMLSelectElement;
    const storyInput = document.getElementById('taskStory') as HTMLSelectElement;
    const userInput = document.getElementById('taskUser') as HTMLSelectElement;
    const timeInput = document.getElementById('taskPredTime') as HTMLInputElement;

    if (nameInput.value)
    {
        const projId = getActiveProjectId()

        if (projId)
        {
            if (storyInput.value)
            {
                const newTask: Task = {
                    projectId: projId,
                    id: LocalStorageTaskCrud.getNewId(),
                    name: nameInput.value,
                    description: descInput.value,
                    priority: priorityInput.value,
                    state: "todo",
                    creationDate: new Date(),
                    storyId: parseInt(storyInput.value),
                    predictedTime: parseInt(timeInput.value),
                    ownerId: parseInt(userInput.value)
                };

                try
                {
                    LocalStorageTaskCrud.create(newTask);
                    nameInput.value = '';
                    descInput.value = '';
                    getTasks();
                }
                catch (error)
                {
                    alert(error.message);
                }
            }
            else
            {
                alert('Wybierz historyjke.');
            }
        }
        else
        {
            alert('Wybierz projekt.');
        }
    }
    else
    {
        alert('Nazwa jest pusta.');
    }
}

function deleteTask(taskId)
{
    if (taskId)
    {
        try
        {
            LocalStorageTaskCrud.delete(parseInt(taskId));
            getTasks();
        }
        catch (error)
        {
            alert(error.message);
        }
    }
}

function getUserOptions(selectedUserId: number)
{
    let taskUserOptions = "";
    const users = LocalStorageUserCrud.getAll();

    for (const user of users)
    {
        const isSelected = user.id == selectedUserId
        taskUserOptions += `<option value=${user.id} ${isSelected ? 'selected' : ''}>${user.firstname} ${user.lastname} - ${user.role}</option>`;
    }
    return taskUserOptions;
}

function getStoryOptions(selectedId: number)
{
    let taskStoryOptions = "";
    const stories = LocalStorageStoryCrud.getProjectStories(getActiveProjectId());

    for (const story of stories)
    {
        const isSelected = story.id == selectedId;
        taskStoryOptions += `<option value=${story.id} ${isSelected ? 'selected' : ''}>${story.name}</option>`;
    }
    return taskStoryOptions;
}



export function initTasks()
{
    document.getElementById('createButton')?.addEventListener('click', createTask);
    document.getElementById('deleteButton')?.addEventListener('click', deleteTask);

    getTasks();
}

function getTaskStates(state: string)
{
    if (state == "todo")
    {
        return `<option value="todo" selected}>do zrobienia</option>
                <option value="ongoing">w trakcie</option>`;
    }
    else
    {
        return `<option value="todo">do zrobienia</option>
                <option value="ongoing" ${state == 'ongoing' ? 'selected' : ''}>w trakcie</option>
                <option value="done" ${state == 'done' ? 'selected' : ''}>skończone</option>`;
    }
}
