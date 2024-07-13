export class Story
{
    projectId: number;
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high"
    state: "todo" | "ongoing" | "done";
    creationDate: Date;
}