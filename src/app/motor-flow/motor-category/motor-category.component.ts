import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-motor-category',
    templateUrl: './motor-category.component.html',
    styleUrls: ['./motor-category.component.css'],
    standalone: false
})
export class MotorCategoryComponent {
  categArray: any = [];
  userType = sessionStorage.getItem('userType');
  dir:any;
  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.categArray = res.data;
      })
  }

  categSelect(value:any){
    var catId = value.id;
    this.authService.getMotorSubCateg(catId).subscribe(
      (res: any) => { 
       if(res.data == ''){
        this.router.navigate([`/motor_terms/${catId}`])
       }else{
        this.router.navigate([`/motor_category/${catId}`]);
       }
      })
  }

}
