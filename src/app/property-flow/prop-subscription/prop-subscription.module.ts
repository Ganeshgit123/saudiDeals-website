import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropSubscriptionComponent } from './prop-subscription.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [PropSubscriptionComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path:"",
        component: PropSubscriptionComponent
      }
    ]),
  ]
})
export class PropSubscriptionModule { }
