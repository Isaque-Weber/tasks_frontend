import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-dialog-task-confirm-delete',
  standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButton
    ],
  templateUrl: './dialog-task-confirm-delete.component.html',
  styleUrl: './dialog-task-confirm-delete.component.css'
})
export class DialogTaskConfirmDeleteComponent {

}
