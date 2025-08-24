import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsPageComponent } from './terms-page.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TermsPageComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: TermsPageComponent
      }
    ]),
  ]
})
export class TermsPageModule { }
