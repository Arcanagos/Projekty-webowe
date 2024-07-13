export class Task
{
    projectId: number;
    storyId: number;
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high"
    state: "todo" | "ongoing" | "done";
    creationDate: Date;
    startDate: Date;
    endDate: Date;
    predictedTime: number;
    ownerId: number;
}