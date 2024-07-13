import { Project } from '../models/Project';

class LocalStorageProjectCrud
{
    private storageKey = 'projects';
    getAll(): Project[]
    {
        const projects = localStorage.getItem(this.storageKey);
        return projects ? JSON.parse(projects) : [];
    }

    getNewId(): number
    {
        try
        {
            const projects = this.getAll();
            return projects[projects.length - 1].id + 1;
        }
        catch
        {
            return 1;
        }
    }

    checkIfProjectExistsById(id: number)
    {
        const projects = this.getAll();
        for (let project of projects)
        {
            if (project.id == id)
                return true;
        };

        return false;
    }

    getById(id: number): Project
    {
        if (this.checkIfProjectExistsById(id) == true)
        {
            const projects = this.getAll();
            for (let project of projects)
            {
                if (project.id == id)
                    return project;
            };
        }

        throw new Error("Project not found");
    }

    create(Project: Project)
    {
        if (this.checkIfProjectExistsById(Project.id) == false)
        {
            const projects = this.getAll();
            projects.push(Project);
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
            return;
        }

        throw new Error("Project already exists");
    }

    update(updatedProject: Project)
    {
        if (this.checkIfProjectExistsById(updatedProject.id) == true)
        {
            let projects = this.getAll();
            projects = projects.map(project => project.id == updatedProject.id ? updatedProject : project);
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
            return;
        }

        throw new Error("Project not found");
    }

    delete(id: number)
    {
        if (this.checkIfProjectExistsById(id) == true)
        {
            let projects = this.getAll();
            projects = projects.filter(project => project.id != id);
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
            return;
        }

        throw new Error("Project not found");
    }
}

export default new LocalStorageProjectCrud();