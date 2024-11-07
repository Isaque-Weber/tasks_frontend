import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Task, TasksService} from '../services/tasks.service';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatFabButton, MatMiniFabButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {
    DialogTaskConfirmDeleteComponent
} from '../dialogs/dialog-task-confirm-delete/dialog-task-confirm-delete.component';
import {NgClass} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragEnd,
    CdkDragHandle,
    CdkDragStart,
    CdkDropList,
    moveItemInArray
} from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [
        RouterLink,
        MatIcon,
        MatFabButton,
        MatMiniFabButton,
        MatButton,
        NgClass,
        CdkDropList,
        CdkDrag,
        CdkDragHandle
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
    @ViewChild('tasksTable', {static: true}) tasksTable!: ElementRef;
    readonly dialog = inject(MatDialog);
    tasks: Task[] = [];
    public isCreatingTask: boolean = false;
    public isEditingTask: false | string = false;

    constructor(
        private readonly _tasksService: TasksService,
        private readonly snackBar: MatSnackBar
    ) {
    }

    async ngOnInit() {
        this.tasks = (await this._tasksService.getTasks()).sort((a, b) => b.order - a.order);
    }

    addTask(): void {
        this.isCreatingTask = true;
    }

    async updateTask(taskName: string, taskCost: string, taskDate: string, taskId: string) {
        if (!taskName || !taskCost || !taskDate) {
            this.snackBar.open("Todos os campos (nome, custo e data) são obrigatórios.", "Fechar", {
                duration: 4000,
                verticalPosition: 'top'
            });
            return;
        }

       try {
            const updatedTask = await this._tasksService.updateTask(taskId, {
                name: taskName,
                cost: Number(taskCost),
                date: taskDate
            });

            this.tasks = this.tasks.map(task => {
                if (task.id === taskId) {
                    return updatedTask;
                }
                return task;
            });

            this.isEditingTask = false;
        } catch (e) {
            console.error("Erro ao atualizar tarefa:", e);
            this.snackBar.open("Não é possível criar tarefas com nomes iguais. Tente novamente.", "Fechar", {
                duration: 4000,
                verticalPosition: 'top'
            });
        }
    }

    async cancelEditTask(inputName: HTMLInputElement, inputCost:HTMLInputElement, inputDate: HTMLInputElement, taskId: string) {
        const task = this.tasks.find(task => task.id == taskId);

        if (!task) return;
        inputName.value = task.name;
        inputCost.value = String(task.cost);
        inputDate.value = task.date;

        this.isEditingTask = false;
    }

    async saveNewTask(taskName: string, taskCost: string, taskDate: string) {
        if (!taskName || !taskCost || !taskDate){
            this.snackBar.open("Todos os campos (nome, custo e data) são obrigatórios.", "Fechar", {
                duration: 4000,
                verticalPosition: 'top'
            });
            return;
        }

        try {
            const task = await this._tasksService.createTask({
                name: taskName,
                cost: Number(taskCost),
                date: taskDate
            });
            this.tasks.unshift(task);
            this.isCreatingTask = false;
        } catch (e) {
           console.error(e);
              this.snackBar.open("Não é possível criar tarefas com nomes iguais. Tente novamente.", "Fechar", {
                  duration: 4000,
                  verticalPosition: 'top'
              });



        }
    }

    async cancelNewTask(inputName: HTMLInputElement, inputCost: HTMLInputElement, inputDate: HTMLInputElement) {
        inputName.value = '';
        inputCost.value = '';
        inputDate.value = '';
        this.isCreatingTask = false;
    }

    enableEditTask(taskId: string): void {
        this.isEditingTask = taskId;
    }

    deleteDialog(taskId: string): void {
        this.dialog.open(DialogTaskConfirmDeleteComponent, {
            width: '450px',
            data: {
                taskId
            },
            enterAnimationDuration: '100ms',
            exitAnimationDuration: '100ms',
        }).afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    await this._tasksService.deleteTask(taskId);
                    this.tasks = this.tasks.filter(task => task.id !== taskId);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    startDragging(event: CdkDragStart, stark: boolean) {
        if (stark) {
            document.documentElement.style.setProperty('--color-dragging-background', 'antiquewhite');
        }
        document.body.style.cursor = 'grabbing';
    }

    endedDragging(event: CdkDragEnd) {
        document.documentElement.style.setProperty('--color-dragging-background', '#fff');
        document.body.style.cursor = 'auto';
    }


    async drop(event: CdkDragDrop<{ title: string; poster: string }[]>) {
        const taskToMove = this.tasks[event.previousIndex];
        const newOrder = this.tasks[event.currentIndex].order;
        moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);

        try {
            await this._tasksService.updateTaskOrder(taskToMove.id, newOrder);
        } catch (e) {
            alert('Erro ao mover tarefa');
            window.location.reload();
        }
    }
}
