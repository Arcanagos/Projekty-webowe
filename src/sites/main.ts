import { renderProj, initProj } from './projects';
import { renderStory, initStories } from './stories';
import LocalStorageUserCrud from '../operations/LocalStorageUserCrud';
import { renderTask, initTasks } from './tasks';
import { renderUser } from './user';

const displayArea = document.getElementById('displayArea');
let activeProjectId: number | undefined;

let activeUserId = 1;
LocalStorageUserCrud.mockUsers();

document.getElementById('loginButton').addEventListener('click', () =>
{
    login();
});

function login()
{
    const login = document.getElementById("login") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    if (LocalStorageUserCrud.login(login.value, password.value))
    {
        onLoginSucces();
    }
    else
    {
        alert("Niepoprawne dane logowania");
    }
}

function onLoginSucces()
{

    function navigate(view: () => string)
    {
        if (displayArea)
        {
            displayArea.innerHTML = view();
        }
    }

    document.getElementById('Projects').addEventListener('click', () =>
    {
        navigate(renderProj);
        initProj();
    });
    document.getElementById('Stories').addEventListener('click', () =>
    {
        navigate(renderStory);
        initStories();
    });
    document.getElementById('Tasks').addEventListener('click', () =>
    {
        navigate(renderTask);
        initTasks();
    });
    document.getElementById('User').addEventListener('click', () => navigate(renderUser));

    navigate(renderProj);
    initProj();
}

export function getActiveProjectId()
{
    return activeProjectId;
}

export function setActiveProjectId(projectId: number | undefined)
{
    activeProjectId = projectId;
}

export function getActiveUserId()
{
    return activeUserId;
}