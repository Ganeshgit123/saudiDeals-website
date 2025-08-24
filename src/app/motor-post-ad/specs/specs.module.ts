import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecsComponent } from './specs.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [SpecsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    TranslateModule,
    AngularEditorModule,
    RouterModule.forChild([
      {
        path: "",
        component: SpecsComponent
      },
    ])
  ]
})
export class SpecsModule { }
