import { Story } from '../models/Story';

class LocalStorageStoryCrud
{
    private storageKey = 'stories';
    getAll(): Story[]
    {
        const stories = localStorage.getItem(this.storageKey);
        return stories ? JSON.parse(stories) : [];
    }

    getProjectStories(projectId: number)
    {
        let stories = this.getAll();
        stories = stories.filter(story => story.projectId == projectId);

        return stories;
    }

    getNewId(): number
    {
        try
        {
            const stories = this.getAll();
            return stories[stories.length - 1].id + 1;
        }
        catch
        {
            return 1;
        }
    }

    checkIfModelExistsById(id: number)
    {
        const stories = this.getAll();
        for (let story of stories)
        {
            if (story.id == id)
                return true;
        };

        return false;
    }

    getById(id: number): Story
    {
        if (this.checkIfModelExistsById(id) == true)
        {
            const stories = this.getAll();
            for (let story of stories)
            {
                if (story.id == id)
                    return story;
            };
        }

        throw new Error("Story not found");
    }

    create(story: Story)
    {
        if (this.checkIfModelExistsById(story.id) == false)
        {
            const stories = this.getAll();
            stories.push(story);
            localStorage.setItem(this.storageKey, JSON.stringify(stories));
            return;
        }

        throw new Error("Story already exists");
    }

    update(updatedModel: Story)
    {
        if (this.checkIfModelExistsById(updatedModel.id) == true)
        {
            let stories = this.getAll();
            stories = stories.map(story => story.id == updatedModel.id ? updatedModel : story);
            localStorage.setItem(this.storageKey, JSON.stringify(stories));
            return;
        }

        throw new Error("Story not found");
    }

    delete(id: number)
    {
        if (this.checkIfModelExistsById(id) == true)
        {
            let stories = this.getAll();
            stories = stories.filter(story => story.id != id);
            localStorage.setItem(this.storageKey, JSON.stringify(stories));
            return;
        }

        throw new Error("Story not found");
    }
}

export default new LocalStorageStoryCrud();