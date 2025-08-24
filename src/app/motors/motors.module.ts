import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorsComponent } from './motors.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MotorsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: MotorsComponent
      }
    ]),
  ]
})
export class MotorsModule { }
