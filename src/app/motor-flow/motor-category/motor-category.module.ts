import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorCategoryComponent } from './motor-category.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MotorCategoryComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: MotorCategoryComponent
      }
    ]),
  ]
})
export class MotorCategoryModule { }
