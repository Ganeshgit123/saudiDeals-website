import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-sub-sub-category',
    templateUrl: './sub-sub-category.component.html',
    styleUrls: ['./sub-sub-category.component.css'],
    standalone: false
})
export class SubSubCategoryComponent {
  subSubCategArray: any = [];
  params: any;
  subParams: any;
  cateeName: any;
  subCateeName: any;
  userType = sessionStorage.getItem('userType');
  dir:any;
  
  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.params = params['subcateg'];
      this.subParams = params['subSubcateg'];
    });

    this.authService.getMotorSubSubCateg(this.subParams).subscribe(
      (res: any) => {
        this.subSubCategArray = res.data;
      })

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.params == element.id) {
            this.cateeName = element.name;
          }
        });
      })

    this.authService.getMotorSubCateg(this.params).subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.subParams == element.id) {
            this.subCateeName = element.motorCategoriesName;
          }
        });
      })
  }

  subSubCateg(value: any) {
    var subSubCatId = value.id;
    this.router.navigate([`/motor_terms/${this.params}/${this.subParams}/${subSubCatId}`])
  }
}
