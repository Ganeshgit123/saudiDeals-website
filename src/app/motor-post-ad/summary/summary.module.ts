import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    RouterModule.forChild([
      {
        path: "",
        component: SummaryComponent
      },
    ]),
  ]
})
export class SummaryModule { }
