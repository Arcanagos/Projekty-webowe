import { Story } from '../models/Story';
import LocalStorageStoryCrud from '../operations/LocalStorageStoryCrud';
import { getActiveProjectId } from './main';

export function renderStory()
{
    return `
    <h1 class="text-3xl font-bold p-4 l-4 text-white dark:text-black">Historyjki localstorage</h1>
    </div>
    <div class="p-4 m-2 w-1/3">
        <input id="storyName" placeholder="Nazwa" class="w-full rounded p-2 m-1 dark:bg-gray-700">
        <textarea id="storyDesc" placeholder="Opis" class="w-full rounded p-2 m-1 dark:bg-gray-700""></textarea>
        
        <label>Priorytet</label>
        <select id="storyPriority" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          <option value="low" selected>Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>

        <label>Status</label>
        <select id="storyState" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
          <option value="todo" selected>do zrobienia</option>
          <option value="ongoing">w trakcie</option>
          <option value="done">skończone</option>
        </select>

        <button id="createButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded dark:text-black dark:bg-blue-900">Stwórz historyjke</button>
    </div>
    <div id="storyList" class="grid grid-cols-3 gap-4">
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

function renderStories(story: Story, dateString: string)
{
    return `
    <div id="storyId" data-id="${story.id}" class="p-4 m-3 border-slate-600 rounded shadow-md hover:shadow-lg bg-blue-600 dark:bg-gray-800">
        <input id="nameInput" class="w-full rounded p-2 m-1 dark:bg-gray-700" value="${story.name}">
        <textarea id="descInput" class="w-full rounded p-2 m-1 dark:bg-gray-700">${story.description}</textarea>

        <label>Priorytet</label>
        <select id="priorityInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
            <option value="low" ${story.priority === 'low' ? 'selected' : ''}>Niski</option>
            <option value="medium" ${story.priority === 'medium' ? 'selected' : ''}>Średni</option>
            <option value="high" ${story.priority === 'high' ? 'selected' : ''}>Wysoki</option>
        </select>

        <label>Status</label>
        <select id="stateInput" class="w-full rounded p-2 m-1 dark:bg-gray-700"">
            <option value="todo" ${story.state === 'todo' ? 'selected' : ''}>do zrobienia</option>
            <option value="ongoing" ${story.state === 'ongoing' ? 'selected' : ''}>w trakcie</option>
            <option value="done" ${story.state === 'done' ? 'selected' : ''}>skończone</option>
        </select>

        <p>Data utworzenia: ${dateString} </p>
        <div class="flex justify-between mt-2">
            <button id="updateButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-blue-900">Aktualizuj</button>
            <button id="deleteButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-red-900">Usuń</button>
        </div>
    </div>
  `;
}

function updateStoryDiv(id: number, div: HTMLElement)
{
    try
    {
        const nameInput = div.querySelector('#nameInput') as HTMLInputElement;
        const descInput = div.querySelector('#descInput') as HTMLTextAreaElement;
        const priorityInput = div.querySelector('#priorityInput') as HTMLSelectElement;
        const stateInput = div.querySelector('#stateInput') as HTMLSelectElement;

        const newStory: Story = {
            projectId: getActiveProjectId(),
            id: id,
            name: nameInput.value,
            description: descInput.value,
            priority: priorityInput.value,
            state: stateInput.value,
            creationDate: new Date()
        };

        LocalStorageStoryCrud.update(newStory);
        getStories();
    }
    catch (error)
    {
        alert(error.message);
    }
}

function getStories()
{
    const todoListDiv = document.getElementById('todoList');
    const ongoingListDiv = document.getElementById('ongoingList');
    const doneListDiv = document.getElementById('doneList');
    const stories = LocalStorageStoryCrud.getProjectStories(getActiveProjectId());

    todoListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Nierozpoczęte</h1>';
    ongoingListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">W trakcie</h1>';
    doneListDiv.innerHTML = '<h1 class="text-2xl font-bold p-4 l-4 text-white dark:text-black">Skończone</h1>';

    stories.forEach(function (story)
    {
        const formattedDate = story.creationDate.toString().substring(0, 10);

        let elem = renderStories(story, formattedDate);

        if (story.state == "todo")
        {
            todoListDiv.innerHTML += elem;
        }
        else if (story.state == "ongoing")
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
            const storyId = button.parentElement.parentElement.dataset.id;
            updateStoryDiv(parseInt(storyId), button.parentElement.parentElement);
        });
    });

    document.querySelectorAll('#deleteButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            const storyId = button.parentElement.parentElement.dataset.id;
            deleteStory(storyId);
        });
    });
}

function createStory()
{
    const nameInput = document.getElementById('storyName') as HTMLInputElement;
    const descInput = document.getElementById('storyDesc') as HTMLTextAreaElement;
    const priorityInput = document.getElementById('storyPriority') as HTMLSelectElement;
    const stateInput = document.getElementById('storyState') as HTMLSelectElement;

    if (nameInput.value)
    {
        const projId = getActiveProjectId()

        if (projId)
        {
            const newStory: Story = {
                projectId: projId,
                id: LocalStorageStoryCrud.getNewId(),
                name: nameInput.value,
                description: descInput.value,
                priority: priorityInput.value,
                state: stateInput.value,
                creationDate: new Date()
            };

            try
            {
                LocalStorageStoryCrud.create(newStory);
                nameInput.value = '';
                descInput.value = '';
                getStories();
            }
            catch (error)
            {
                alert(error.message);
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

function deleteStory(storyId)
{
    if (storyId)
    {
        try
        {
            LocalStorageStoryCrud.delete(parseInt(storyId));
            getStories();
        }
        catch (error)
        {
            alert(error.message);
        }
    }
}

export function initStories()
{
    document.getElementById('createButton')?.addEventListener('click', createStory);
    document.getElementById('deleteButton')?.addEventListener('click', deleteStory);

    getStories();
}
