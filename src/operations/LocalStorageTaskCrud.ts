import { Task } from '../models/Task';

class LocalStorageTaskCrud
{
    private storageKey = 'tasks';
    getAll(): Task[]
    {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
    }

    getProjectTasks(projectId: number)
    {
        let tasks = this.getAll();
        tasks = tasks.filter(task => task.projectId == projectId);

        return tasks;
    }

    getNewId(): number
    {
        try
        {
            const tasks = this.getAll();
            return tasks[tasks.length - 1].id + 1;
        }
        catch
        {
            return 1;
        }
    }

    checkIfModelExistsById(id: number)
    {
        const tasks = this.getAll();
        for (let task of tasks)
        {
            if (task.id == id)
                return true;
        };

        return false;
    }

    getById(id: number): Task
    {
        if (this.checkIfModelExistsById(id) == true)
        {
            const tasks = this.getAll();
            for (let task of tasks)
            {
                if (task.id == id)
                    return task;
            };
        }

        throw new Error("Task not found");
    }

    create(task: Task)
    {
        if (this.checkIfModelExistsById(task.id) == false)
        {
            const tasks = this.getAll();
            tasks.push(task);
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return;
        }

        throw new Error("task already exists");
    }

    update(updatedModel: Task)
    {
        if (this.checkIfModelExistsById(updatedModel.id) == true)
        {
            let tasks = this.getAll();
            tasks = tasks.map(task => task.id == updatedModel.id ? updatedModel : task);
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return;
        }

        throw new Error("Task not found");
    }

    delete(id: number)
    {
        if (this.checkIfModelExistsById(id) == true)
        {
            let tasks = this.getAll();
            tasks = tasks.filter(task => task.id != id);
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return;
        }

        throw new Error("Task not found");
    }
}

export default new LocalStorageTaskCrud();