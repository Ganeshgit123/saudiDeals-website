import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryComponent } from './sub-category.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SubCategoryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: SubCategoryComponent
      }
    ]),
  ]
})
export class SubCategoryModule { }
