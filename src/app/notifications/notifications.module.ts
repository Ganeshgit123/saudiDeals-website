import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: NotificationsComponent
      }
    ]),
  ]
})
export class NotificationsModule { }
