import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCategoryComponent } from './select-category.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SelectCategoryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: SelectCategoryComponent
      }
    ]),
  ]
})
export class SelectCategoryModule { }
