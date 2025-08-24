import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubSubCategoryComponent } from './sub-sub-category.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SubSubCategoryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: SubSubCategoryComponent
      }
    ]),
  ]
})
export class SubSubCategoryModule { }
