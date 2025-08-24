import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-motor-subscription',
    templateUrl: './motor-subscription.component.html',
    styleUrls: ['./motor-subscription.component.css'],
    standalone: false
})
export class MotorSubscriptionComponent {
  role = sessionStorage.getItem("userType");
  mainCategId: any;
  subCategId: any;
  subSubCategId: any;
  subsList = [];
  postId: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.authService.getSubscripPackage('MOTOR').subscribe(
      (res: any) => {
        this.subsList = res.data.reverse();
      })

    this.route.params.subscribe((params) => {
      this.mainCategId = params['categ'];
      this.subCategId = params['subcateg'];
      this.subSubCategId = params['subSubcateg'];
      this.postId = params['postId'];
    });
  }

  buyPackage(data) {
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

    const result: Date = addDays(date, data.subscriptionsTime);
    let endyear = result.getFullYear();
    let endmonth = result.getMonth() + 1; // Months are zero-based, so add 1
    let endday = result.getDate();

    // Format the date as a string (YYYY-MM-DD)
    let endDate = `${endyear}-${endmonth < 10 ? '0' : ''}${endmonth}-${endday < 10 ? '0' : ''}${endday}`;

    // console.log("ki",endDate)
    if (!this.postId) {
      sessionStorage.setItem('motorPackageBuyId', data.id);
      this.router.navigate([`/motor_category/`]);
    } else {
      sessionStorage.setItem('motorPackageBuyId', data.id);
      if (!(this.subCategId == null || this.subCategId == 0) && (this.subSubCategId == null || this.subSubCategId == 0)) {
        this.router.navigate([`/post-ad-motor/${this.mainCategId}/${this.subCategId}/description/${this.postId}`]);
      } else if (!(this.subCategId == null || this.subCategId == 0) && !(this.subSubCategId == null || this.subSubCategId == 0)) {
        this.router.navigate([`/post-ad-motor/${this.mainCategId}/${this.subCategId}/${this.subSubCategId}/description/${this.postId}`]);
      } else {
        this.router.navigate([`/post-ad-motor/${this.mainCategId}/description/${this.postId}`]);
      }
      // Renewal Flow
      // this.spinner.show();
      // const object = {
      //   subscriptionId: data.id,
      //   userId: sessUserId,
      //   startDate: todayDate,
      //   endDate: endDate,
      //   totalPost: data.totalPost,
      //   remainingDays: data.subscriptionsTime,
      //   remainingPost: data.totalPost - 1,
      //   type: "MOTOR",
      // }
      // // console.log("Fwefd",object)
      // this.authService.buySubscription(object)
      //   .subscribe((res: any) => {
      //     if (res.success == true) {
      //       this.toastr.success('Success', res.massage);
      //       const subScribedId = res.result.id;
      //       const object = {
      //         location: subScribedId,
      //       }
      //       this.authService.motorPostLevelUpdate(object, this.postId)
      //         .subscribe((res: any) => {
      //           if (res.success == true) {
      //             this.spinner.hide();
      //             this.router.navigate([`/my_ads`]);
      //           } else {
      //             this.toastr.error('Error', res.massage);
      //           }
      //         })
      //     } else {
      //       this.toastr.error('Error', res.massage);
      //     }
      //   })
    }
  }
}
