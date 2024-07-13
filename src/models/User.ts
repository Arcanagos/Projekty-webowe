export class User
{
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    role: "Developer" | "Devops" | "Admin";
    password: string;
}