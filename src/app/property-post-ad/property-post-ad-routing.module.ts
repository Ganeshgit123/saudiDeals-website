import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: 'description',
        loadChildren: () => import("./description/description.module").then((m) => m.DescriptionModule),
      },
      {
        path: 'description/:id',
        loadChildren: () => import("./description/description.module").then((m) => m.DescriptionModule),
      },
      {
        path: 'images-location',
        loadChildren: () => import("./images-location/images-location.module").then((m) => m.ImagesLocationModule),
      },
      {
        path: 'images-location/:id',
        loadChildren: () => import("./images-location/images-location.module").then((m) => m.ImagesLocationModule),
      },
      {
        path: 'specifications',
        loadChildren: () => import("./specification/specification.module").then((m) => m.SpecificationModule),
      },
      {
        path: 'specifications/:id',
        loadChildren: () => import("./specification/specification.module").then((m) => m.SpecificationModule),
      },
      {
        path: 'extras',
        loadChildren: () => import("./extras/extras.module").then((m) => m.ExtrasModule),
      },
      {
        path: 'extras/:id',
        loadChildren: () => import("./extras/extras.module").then((m) => m.ExtrasModule),
      },
      {
        path: 'summary',
        loadChildren: () => import("./summary/summary.module").then((m) => m.SummaryModule),
      },
      {
        path: 'summary/:id',
        loadChildren: () => import("./summary/summary.module").then((m) => m.SummaryModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyPostAdRoutingModule { }
