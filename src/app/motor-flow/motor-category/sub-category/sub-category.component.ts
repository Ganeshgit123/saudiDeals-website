import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.css'],
    standalone: false
})
export class SubCategoryComponent {
  categArray: any = [];
  subCategArray: any = [];
  params: any;
  cateeName: any;
  userType = sessionStorage.getItem('userType');
  dir:any;
  
  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.params = params['subcateg'];
    });

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.categArray = res.data;
        this.categArray.forEach((element: any) => {
          if (this.params == element.id) {
            this.cateeName = element.name;
          }
        });
      })

    this.authService.getMotorSubCateg(this.params).subscribe(
      (res: any) => {
        this.subCategArray = res.data;
      })
  }

  subCategSelect(value:any){
    var subCatId = value.id;
    this.authService.getMotorSubSubCateg(subCatId).subscribe(
      (res: any) => {
        if(res.data == ''){
          this.router.navigate([`/motor_terms/${this.params}/${subCatId}`]);
         }else{
          this.router.navigate([`/motor_category/${this.params}/${subCatId}`]);
         }
      })
  }
}
