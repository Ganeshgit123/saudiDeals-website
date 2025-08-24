import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorSubscriptionComponent } from './motor-subscription.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    MotorSubscriptionComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path:"",
        component: MotorSubscriptionComponent
      }
    ]),
  ]
})
export class MotorSubscriptionModule { }
