import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesLocationComponent } from './images-location.component';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ImagesLocationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    DragDropModule,
    NgxSpinnerModule,
    TranslateModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: "",
        component: ImagesLocationComponent
      },
    ]),
  ]
})
export class ImagesLocationModule { }
