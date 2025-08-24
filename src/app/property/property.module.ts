import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyComponent } from './property.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PropertyComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: PropertyComponent
      }
    ]),
  ]
})
export class PropertyModule { }
