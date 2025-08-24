import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditionComponent } from './terms-condition.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TermsConditionComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: TermsConditionComponent
      }
    ]),
  ]
})
export class TermsConditionModule { }
