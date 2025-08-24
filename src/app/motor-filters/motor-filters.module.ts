import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotorFiltersComponent } from './motor-filters.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from "@angular/material/select";
import { CurrencyPipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  providers: [CurrencyPipe],
  declarations: [
    MotorFiltersComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxPaginationModule,
    RouterModule.forChild([
      {
        path:"",
        component: MotorFiltersComponent
      }
    ]),
  ]
})
export class MotorFiltersModule { }
