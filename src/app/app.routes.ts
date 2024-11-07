import {Routes} from '@angular/router';
import {TasksComponent} from './resources/tasks/tasks.component';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: '**',
    redirectTo: '/tasks',
  }
];
