import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyFiltersComponent } from './property-filters.component';
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
    PropertyFiltersComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatFormFieldModule,
    RouterModule.forChild([
      {
        path:"",
        component: PropertyFiltersComponent
      }
    ]),
  ]
})
export class PropertyFiltersModule { }
