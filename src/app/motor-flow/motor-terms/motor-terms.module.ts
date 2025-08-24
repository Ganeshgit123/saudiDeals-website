import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorTermsComponent } from './motor-terms.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MotorTermsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: MotorTermsComponent
      }
    ]),
  ]
})
export class MotorTermsModule { }
