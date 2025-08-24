import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpComponent } from './otp.component';
import { RouterModule } from '@angular/router';
import { NgOtpInputModule } from  'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OtpComponent
  ],
  imports: [
    CommonModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path:"",
        component: OtpComponent
      }
    ]),
  ]
})
export class OTPModule { }
