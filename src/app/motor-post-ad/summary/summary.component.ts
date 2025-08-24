import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css'],
    standalone: false
})
export class SummaryComponent {
  subSubCategArray: any = [];
  params: any;
  subParams: any;
  cateeName: any;
  subCateeName: any;
  subSubParams: any;
  subSubcateeName: any;
  getPostedData = [];
  idParams: any;
  dir: any;
  imageArray = [];
  packageBuyId: any;
  motorSubList = [];
  subscribedListId: any;
  motorPackageLength: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.packageBuyId = sessionStorage.getItem('motorPackageBuyId');
    this.spinner.hide();
    // console.log("fef",this.packageBuyId)
    this.route.params.subscribe((params) => {
      this.params = params['categ'];
      this.subParams = params['subcateg'];
      this.subSubParams = params['subSubcateg'];
      this.idParams = params['id'];
    });

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.params == element.id) {
            if (this.dir == 'ltr') {
              this.cateeName = element.name;
            } else if (this.dir == 'rtl') {
              this.cateeName = element.arName;
            }
          }
        });
      })

    this.authService.getMotorSubCateg(this.params).subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.subParams == element.id) {
            if (this.dir == 'ltr') {
              this.subCateeName = element.motorCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subCateeName = element.arMotorCategoriesName;
            }
          }
        });
      })

    this.authService.getMotorSubSubCateg(this.subParams).subscribe(
      (res: any) => {
        this.subSubCategArray = res.data;
        res.data.forEach((element: any) => {
          if (this.subSubParams == element.id) {
            if (this.dir == 'ltr') {
              this.subSubcateeName = element.motorSubCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subSubcateeName = element.arMotorSubCategoriesName;
            }
          }
        });
      })
    const postId = sessionStorage.getItem('postId');
    this.authService.getPostedPost(postId).subscribe(
      (res: any) => {
        this.getPostedData = res.data;
        this.imageArray = res.data[0].image.sort(function (first, second) {
          return first.order - second.order;
        });
        // console.log("ve",this.getPostedData)
      })

    this.authService.getSubscripPackage('MOTOR').subscribe(
      (res: any) => {
        this.motorSubList = res.data.filter(element => {
          return element.id == this.packageBuyId;
        })
        this.motorPackageLength = this.motorSubList.length;
        // console.log("sublist", this.motorSubList)
      })
  }

  placeAdSubmit() {
    if (this.motorPackageLength != 0) {
      this.spinner.show();
      const sessUserId = Number(localStorage.getItem('saudiDealsUserId'));

      let date: Date = new Date()
      let today = new Date();

      // Extract the components of the date (year, month, day)
      let year = today.getFullYear();
      let month = today.getMonth() + 1; // Months are zero-based, so add 1
      let day = today.getDate();

      // Format the date as a string (YYYY-MM-DD)
      let todayDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

      const addDays = (date: Date, days: number): Date => {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };

      const result: Date = addDays(date, this.motorSubList[0].subscriptionsTime);
      let endyear = result.getFullYear();
      let endmonth = result.getMonth() + 1; // Months are zero-based, so add 1
      let endday = result.getDate();

      // Format the date as a string (YYYY-MM-DD)
      let endDate = `${endyear}-${endmonth < 10 ? '0' : ''}${endmonth}-${endday < 10 ? '0' : ''}${endday}`;
      const subData = {
        subscriptionId: this.motorSubList[0].id,
        userId: sessUserId,
        startDate: todayDate,
        endDate: endDate,
        totalPost: this.motorSubList[0].totalPost,
        remainingDays: this.motorSubList[0].subscriptionsTime,
        remainingPost: this.motorSubList[0].totalPost,
        type: "MOTOR",
      }
      // console.log("Fwefd",object)
      this.authService.buySubscription(subData)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            const postId = sessionStorage.getItem('postId');
            const object = { isApprove: 0, updateStatusLevel: 3, subscriptionId: res.result.id, newPost: 1 };
            this.authService.motorPostLevelUpdate(object, postId)
              .subscribe((res: any) => {
                if (res.success == true) {
                  this.spinner.hide();
                  this.authService.showToast('success', 'Ad Placed Successfully');
                  sessionStorage.removeItem("postId");
                  sessionStorage.removeItem("motorPackageBuyId");
                  this.router.navigate(['/']);
                } else {
                  this.toastr.error('Error', res.massage);
                }
              })
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else if (this.motorPackageLength == 0) {
      this.spinner.show();
      const postId = sessionStorage.getItem('postId');
      const object = { isApprove: 0, updateStatusLevel: 3 };
      this.authService.motorPostLevelUpdate(object, postId)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.authService.showToast('success', 'Ad Edited Successfully');
            this.spinner.hide();
            sessionStorage.removeItem("postId");
            this.router.navigate(['/']);
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    }
  }
  
  editPost() {
    // console.log("dfwe",data)
    if (this.subParams != undefined && this.subSubParams == undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/description/${this.idParams}`]);
    } else if (this.subParams != undefined && this.subSubParams != undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/description/${this.idParams}`]);
    } else {
      this.router.navigate([`/post-ad-motor/${this.params}/description/${this.idParams}`]);
    }
  }
}
