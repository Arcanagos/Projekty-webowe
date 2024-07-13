import { User } from '../models/User';

class LocalStorageUserCrud
{
    private storageKey = 'users';

    getAll(): User[]
    {
        const users = localStorage.getItem(this.storageKey);
        return users ? JSON.parse(users) : [];
    }

    checkIfModelExistsById(id: number)
    {
        const users = this.getAll();
        for (let user of users)
        {
            if (user.id == id)
                return true;
        };

        return false;
    }

    getById(id: number): User
    {
        if (this.checkIfModelExistsById(id) == true)
        {
            const users = this.getAll();
            for (let user of users)
            {
                if (user.id == id)
                    return user;
            };
        }

        throw new Error("User not found");
    }

    mockUsers()
    {
        let users: User[] = [];

        let newUser = new User();
        newUser.id = 1;
        newUser.firstname = "Rafał";
        newUser.lastname = "Kwiecień";
        newUser.username = "rk";
        newUser.role = "Admin";
        newUser.password = "qwerty";
        users.push(newUser);

        newUser = new User();
        newUser.id = 2;
        newUser.firstname = "Jan";
        newUser.lastname = "Kowalski";
        newUser.username = "jk";
        newUser.role = "Devops";
        newUser.password = "qwerty";
        users.push(newUser);

        newUser = new User();
        newUser.id = 3;
        newUser.firstname = "Andrzej";
        newUser.lastname = "Śliwka";
        newUser.username = "as";
        newUser.role = "Developer";
        newUser.password = "qwerty";
        users.push(newUser);

        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    login(username: string, password: string)
    {
        const users = this.getAll();

        for (let user of users)
        {
            if (user.username == username && user.password == password)
            {
                return true;
            }
        }

        return false;
    }
}

export default new LocalStorageUserCrud();