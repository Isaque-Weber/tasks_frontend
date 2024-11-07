import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export type Task = {
    id: string;
    name: string;
    cost: number;
    date: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    baseURL = `https://tasksbackend-930902532040.us-central1.run.app/tasks`;

    constructor(
        private readonly _http: HttpClient
    ) {
    }

    createTask(task: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'>) {
        const url = `${this.baseURL}`;
        return firstValueFrom(this._http.post<Task>(url, task));
    }

    getTasks() {
        const url = `${this.baseURL}`;
        return firstValueFrom(this._http.get<Task[]>(url));
    }

    updateTask(taskId: string, task: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'>) {
        const url = `${this.baseURL}/${taskId}`;
        return firstValueFrom(this._http.put<Task>(url, task));
    }

    deleteTask(taskId: string) {
        const url = `${this.baseURL}/${taskId}`;
        return firstValueFrom(this._http.delete(url));
    }

    updateTaskOrder(taskId: string, newOrder: number) {
        const url = `${this.baseURL}/${taskId}/order/${newOrder}`;
        return firstValueFrom(this._http.patch(url, {}));
    }
}
