import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAdsComponent } from './my-ads.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyAdsComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: MyAdsComponent
      }
    ]),
  ]
})
export class MyAdsModule { }
