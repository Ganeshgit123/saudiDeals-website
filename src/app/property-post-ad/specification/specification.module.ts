import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecificationComponent } from './specification.component';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpecificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSliderModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: SpecificationComponent
      },
    ])
  ]
})
export class SpecificationModule { }
