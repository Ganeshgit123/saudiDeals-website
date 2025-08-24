import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-prop-subscription',
    templateUrl: './prop-subscription.component.html',
    styleUrls: ['./prop-subscription.component.css'],
    standalone: false
})
export class PropSubscriptionComponent {
  subsList = [];
  postId: any;
  type: any;
  mainCategId: any;
  propPostId: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      this.mainCategId = params['categId'];
      this.propPostId = params['postId'];
    });

    this.authService.getSubscripPackage('PROPERTY').subscribe(
      (res: any) => {
        this.subsList = res.data.reverse();
      })
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
    if (! this.propPostId) {
      sessionStorage.setItem('PropertyPackageBuyId', data.id);
      this.router.navigate([`/main_property/`]);
    } else {
      sessionStorage.setItem('PropertyPackageBuyId', data.id);
      this.router.navigate([`/property-post-ad/${this.type}/${this.mainCategId}/description/${this.propPostId}`]);
      // renew flow
      // this.spinner.show();
      // const object = {
      //   subscriptionId: data.id,
      //   userId: sessUserId,
      //   startDate: todayDate,
      //   endDate: endDate,
      //   totalPost: data.totalPost,
      //   remainingDays: data.subscriptionsTime,
      //   remainingPost: data.totalPost - 1,
      //   type: "PROPERTY",
      // }
      // this.authService.buySubscription(object)
      //   .subscribe((res: any) => {
      //     if (res.success == true) {
      //       this.toastr.success('Success', res.massage);
      //       const subScribedId = res.result.id;
      //       const object = {
      //         location: subScribedId,
      //       }
      //       this.authService.propertyPostLevelUpdate(object, this.postId)
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
