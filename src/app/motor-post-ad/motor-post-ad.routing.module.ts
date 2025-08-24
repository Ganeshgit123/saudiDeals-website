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
                loadChildren: () => import("./specs/specs.module").then((m) => m.SpecsModule),
            },
            {
                path: 'specifications/:id',
                loadChildren: () => import("./specs/specs.module").then((m) => m.SpecsModule),
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
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class MotorPostAdRoutingModule { }