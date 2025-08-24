import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdDetailsComponent } from './ad-details.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GalleryModule } from 'ng-gallery';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { LightboxModule } from 'ng-gallery/lightbox';

@NgModule({
  declarations: [
    AdDetailsComponent,
    DateAgoPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ClipboardModule,
    GalleryModule,
    LightboxModule,
    RouterModule.forChild([
      {
        path: "",
        component: AdDetailsComponent
      }
    ]),
  ]
})
export class AdDetailsModule { }
