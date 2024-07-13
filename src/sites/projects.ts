import { Project } from '../models/Project';
import LocalStorageProjectCrud from '../operations/LocalStorageProjectCrud';
import { setActiveProjectId, getActiveProjectId } from './main';

export function renderProj()
{
    return `
    <h1 class="text-3xl font-bold p-4 l-4 text-white dark:text-black">Projekty localstorage</h1>
    </div>
    <div class="p-4 m-2 w-1/3">
        <input id="projectName" placeholder="Nazwa" class="w-full rounded p-2 m-1 dark:bg-gray-700">
        <textarea id="projectDesc" placeholder="Opis" class="w-full rounded p-2 m-1 dark:bg-gray-700" style:"width:500"></textarea>
        <button id="createButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded dark:text-black dark:bg-blue-900">Stwórz projekt</button>
    </div>
    <div id="projectList" class="flex flex-wrap">
    </div>
  `;
}

function renderProjects(project: Project)
{
    return `
    <div id="projectId" data-id="${project.id}" class="p-4 m-3 border-slate-600 rounded shadow-md hover:shadow-lg bg-blue-600 dark:bg-gray-800">
        <input id="nameInput" class="w-full rounded p-2 m-1 dark:bg-gray-700" value="${project.name}">
        <textarea id="descInput" class="w-full rounded p-2 m-1 dark:bg-gray-700">${project.description}</textarea>
        <div class="flex justify-between mt-2">
            <button id="activateButton" class="bg-neutral-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded dark:text-black">Aktywuj</button>
            <button id="updateButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-blue-900">Aktualizuj</button>
            <button id="deleteButton" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded dark:text-black dark:bg-red-900">Usuń</button>
        </div>
    </div>
  `;
}

function updateProjectDiv(id: number, button: HTMLElement)
{
    if (id)
    {
        try
        {
            const nameInput = button.querySelector('#nameInput') as HTMLInputElement;
            const descInput = button.querySelector('#descInput') as HTMLTextAreaElement;

            const newProject: Project = {
                id: id,
                name: nameInput.value,
                description: descInput.value
            };

            LocalStorageProjectCrud.update(newProject);
            getProjects();
        }
        catch (error)
        {
            alert(error.message);
        }
    }
}

function getProjects()
{
    const projectListDiv = document.getElementById('projectList');
    const projects = LocalStorageProjectCrud.getAll();

    projectListDiv.innerHTML = projects.map(project => renderProjects(project)).join('');

    document.querySelectorAll('#updateButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            const projectId = button.parentElement.parentElement.dataset.id;
            updateProjectDiv(parseInt(projectId), button.parentElement.parentElement);
        });
    });

    document.querySelectorAll('#deleteButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            const projectId = button.parentElement.parentElement.dataset.id;
            deleteProject(projectId);
        });
    });

    document.querySelectorAll<HTMLDivElement>('#activateButton').forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            setActiveProject(button);
        });

        const activeId = getActiveProjectId();
        if (parseInt(button.parentElement.parentElement.dataset.id) == activeId)
        {
            button.style.backgroundColor = "DarkGreen";
            button.textContent  = "Dezaktywuj";
        }
    });
}

function setActiveProject(button: HTMLElement)
{
    const previosId = getActiveProjectId();
    const newId = button.parentElement.parentElement.dataset.id;
    const newIdNumber = parseInt(newId);

    if (previosId != newIdNumber)
    {
        setActiveProjectId(newIdNumber);
        button.style.backgroundColor = "DarkGreen";
        button.textContent  = "Dezaktywuj";

        document.querySelectorAll<HTMLDivElement>('#activateButton')
            .forEach(otherButton =>
            {
                if (otherButton.parentElement.parentElement.dataset.id != newId)
                {
                    otherButton.style.backgroundColor = "";
                    button.textContent  = "Aktywuj";
                }
            });
    }
    else
    {
        setActiveProjectId(undefined);
        button.style.backgroundColor = "";
        button.textContent  = "Aktywuj";
    }
}

function createProject()
{
    const nameInput = document.getElementById('projectName') as HTMLInputElement;
    const descInput = document.getElementById('projectDesc') as HTMLTextAreaElement;

    const name = nameInput.value;
    const description = descInput.value;

    if (name)
    {
        const newProject: Project = {
            id: LocalStorageProjectCrud.getNewId(),
            name: name,
            description: description
        };

        try
        {
            LocalStorageProjectCrud.create(newProject);
            nameInput.value = '';
            descInput.value = '';
            getProjects();
        }
        catch (error)
        {
            alert(error.message);
        }
    }
    else
    {
        alert('Nazwa jest pusta.');
    }
}

function deleteProject(projectId)
{
    if (projectId)
    {
        try
        {
            LocalStorageProjectCrud.delete(parseInt(projectId));

            if (getActiveProjectId() == projectId)
            {
                setActiveProjectId(undefined);
            }

            getProjects();
        }
        catch (error)
        {
            alert(error.message);
        }
    }
}

export function initProj()
{
    document.getElementById('createButton')?.addEventListener('click', createProject);
    document.getElementById('deleteButton')?.addEventListener('click', deleteProject);

    getProjects();
}
