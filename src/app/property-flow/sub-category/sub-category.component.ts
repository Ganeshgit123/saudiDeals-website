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
  role = sessionStorage.getItem("userType");
  categArray: any = [];
  categ:any;
  userType = sessionStorage.getItem('userType');
  dir:any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.dir=sessionStorage.getItem('dir') || 'rtl';

    this.route.params.subscribe((params) => {
      this.categ = params['category'];
    });
    if (this.categ == 'rent') {
      this.authService.getPropertyCategory("RENT").subscribe(
        (res: any) => {
          this.categArray = res.data;
        })
    } else if (this.categ == 'sale') {
      this.authService.getPropertyCategory("SALE").subscribe(
        (res: any) => {
          this.categArray = res.data;
        })
    }
  }

  categSelect(id:any){
      this.router.navigate([`/property_terms/${this.categ}/${id}`])
  }
}
