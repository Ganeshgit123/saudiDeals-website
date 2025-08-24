import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFavouriteComponent } from './my-favourite.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    MyFavouriteComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: MyFavouriteComponent
      }
    ]),
  ]
})
export class MyFavouriteModule { }
