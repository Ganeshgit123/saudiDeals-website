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
  subCateg: any;
  params: any;
  category: any;
  cateeName: any;
  getPostedData = [];
  getImages = [];
  imageArray = [];
  packageBuyId: any;
  propertySubList = [];
  subscribedListId: any;
  propertyPackageLength: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.packageBuyId = sessionStorage.getItem('PropertyPackageBuyId');
    this.spinner.hide();

    this.route.params.subscribe((params) => {
      this.category = params['categ'];
      this.subCateg = params['subCateg'];
    });

    if (this.category == 'rent') {
      this.authService.getPropertyCategory("RENT").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (this.subCateg == element.id) {
              this.cateeName = element.en_name;
              // console.log("fff",this.cateeName)
            }
          });
        })
    } else if (this.category == 'sale') {
      this.authService.getPropertyCategory("SALE").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (this.subCateg == element.id) {
              this.cateeName = element.en_name;
              // console.log("tt",this.cateeName)
            }
          });
        })
    }

    const postId = sessionStorage.getItem('propertyPostId');
    this.authService.getPostedPrpertyPost(postId).subscribe(
      (res: any) => {
        this.getPostedData = res.data;
        this.imageArray = res.data[0].image.sort(function (first, second) {
          return first.order - second.order;
        });
      })

    this.authService.getSubscripPackage('PROPERTY').subscribe(
      (res: any) => {
        this.propertySubList = res.data.filter(element => {
          return element.id == this.packageBuyId;
        })
        this.propertyPackageLength = this.propertySubList.length;
        // console.log("sublist", this.motorPackageLength)
      })
  }

  editPost() {
    const postId = sessionStorage.getItem('propertyPostId');
    this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/description/${postId}`]);
  }

  placeAdSubmit() {
    if (this.propertyPackageLength != 0) {
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

      const result: Date = addDays(date, this.propertySubList[0].subscriptionsTime);
      let endyear = result.getFullYear();
      let endmonth = result.getMonth() + 1; // Months are zero-based, so add 1
      let endday = result.getDate();

      // Format the date as a string (YYYY-MM-DD)
      let endDate = `${endyear}-${endmonth < 10 ? '0' : ''}${endmonth}-${endday < 10 ? '0' : ''}${endday}`;
      const subData = {
        subscriptionId: this.propertySubList[0].id,
        userId: sessUserId,
        startDate: todayDate,
        endDate: endDate,
        totalPost: this.propertySubList[0].totalPost,
        remainingDays: this.propertySubList[0].subscriptionsTime,
        remainingPost: this.propertySubList[0].totalPost,
        type: "PROPERTY",
      }
      // console.log("Fwefd",object)
      this.authService.buySubscription(subData)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            const postId = sessionStorage.getItem('propertyPostId');
            const object = { isApprove: 0, updateStatusLevel: 4, subscriptionId: res.result.id, newPost: 1 };
            this.authService.propertyPostLevelUpdate(object, postId)
              .subscribe((res: any) => {
                if (res.success == true) {
                  this.spinner.hide();
                  this.authService.showToast('success', 'Ad Placed Successfully');
                  sessionStorage.removeItem("propertyPostId");
                  sessionStorage.removeItem("PropertyPackageBuyId");
                  this.router.navigate(['/']);
                } else {
                  this.toastr.error('Error', res.massage);
                }
              })
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else if (this.propertyPackageLength == 0) {
      this.spinner.show();
      const postId = sessionStorage.getItem('propertyPostId');
      const object = { isApprove: 0, updateStatusLevel: 4 };
      this.authService.propertyPostLevelUpdate(object, postId)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.spinner.hide();
            this.authService.showToast('success', 'Ad Edit Successfully');
            sessionStorage.removeItem("propertyPostId");
            this.router.navigate(['/']);
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    }
  }
}
