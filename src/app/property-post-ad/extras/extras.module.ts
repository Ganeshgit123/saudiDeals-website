import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtrasComponent } from './extras.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    ExtrasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: "",
        component: ExtrasComponent
      },
    ])
  ]
})
export class ExtrasModule { }
