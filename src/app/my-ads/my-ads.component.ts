import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.css'],
  standalone: false
})
export class MyAdsComponent {
  motorPostArray: any = [];
  propertyPostArray: any = [];
  motorPostCount: any;
  mainCategId: any;
  subCategId: any;
  subSubCategId: any;
  propPostCount: any;
  subscriptionMotorList: any;
  subscriptionPropertyList: any;
  packageList: any;
  subscriptionPackName: any;
  remainDays: any;
  categType: any;
  subListMotorLength: any;
  subListPropertyLength: any;
  differ: any;
  subscType: any;
  filterEndDate: any;
  motorImageArray = [];

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.authService.getPostedAllPost().subscribe(
      (res: any) => {
        var onlyMotorActiveValue = res.data.filter(element => {
          return element.active === 1;
        })

        this.authService.getSubscriptionList().subscribe(
          (res: any) => {
            this.subscriptionMotorList = res.data.filter(element => {
              return element.type === 'MOTOR';
            })
            this.subscriptionMotorList.forEach(element => {
              const endDateCalc = this.calculateDaysToTargetDate(element.endDate);
              if (endDateCalc == `${this.translate.instant("AlreadyExpired")}`) {
                element.remainingPost = 0;
              }
            });
            this.subListMotorLength = this.subscriptionMotorList.length;
            onlyMotorActiveValue.forEach(postElement => {
              this.subscriptionMotorList.forEach(subsElement => {
                if (postElement.subscriptionId == subsElement.id) {
                  const targetDate = subsElement.endDate;
                  subsElement.isApprove = postElement.isApprove;
                  subsElement.updateStatusLevel = postElement.updateStatusLevel;
                  const remainingTime = this.calculateDaysToTargetDate(targetDate);
                  if (remainingTime !== null) {
                    postElement.remainDays = `${remainingTime}`
                  }
                }
              })
            })
            this.motorPostArray = onlyMotorActiveValue.reverse();
            this.motorPostCount = this.motorPostArray.length;
            // console.log("dswe", this.subscriptionMotorList)
          })
      })

    this.authService.getPostedAllProperty().subscribe(
      (res: any) => {
        var onlyPropertyActiveValue = res.data.filter(element => {
          return element.active === 1;
        })
        this.authService.getSubscriptionList().subscribe(
          (res: any) => {
            this.subscriptionPropertyList = res.data.filter(element => {
              return element.type === 'PROPERTY';
            })
            this.subscriptionPropertyList.forEach(element => {
              const endDateCalc = this.calculateDaysToTargetDate(element.endDate);
              if (endDateCalc == `${this.translate.instant("AlreadyExpired")}`) {
                element.remainingPost = 0;
              }
            });
            this.subListPropertyLength = this.subscriptionPropertyList.length;
            onlyPropertyActiveValue.forEach(postElement => {
              this.subscriptionPropertyList.forEach(subsElement => {
                if (postElement.subscriptionId == subsElement.id) {
                  const targetDate = subsElement.endDate;
                  subsElement.isApprove = postElement.isApprove;
                  subsElement.updateStatusLevel = postElement.updateStatusLevel;
                  const remainingTime = this.calculateDaysToTargetDate(targetDate);
                  if (remainingTime !== null) {
                    postElement.remainDays = `${remainingTime}`
                    // console.log(`${remainingTime}`);
                  }
                }
              })
            })
            this.propertyPostArray = onlyPropertyActiveValue.reverse();
            this.propPostCount = this.propertyPostArray.length;
            // console.log("dswe", this.subscriptionPropertyList)
          })
      })
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }

  calculateDaysToTargetDate(targetDate: string): string | null {
    // Create Date objects for today and the target date
    const today = new Date();
    const target = new Date(targetDate);
    // console.log("today",today)
    // console.log("target",target)
    // Calculate the difference in milliseconds
    const timeDifference = target.getTime() - today.getTime();
    // console.log("timedd",timeDifference)
    // Convert milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 0) {
      return `${this.translate.instant("AlreadyExpired")}`;
    } else if (daysDifference === 0) {
      return `${this.translate.instant("AdIsExpiredToday")}`;
    } else {
      return `${this.translate.instant("ExpiresIn")} ${daysDifference} ${this.translate.instant("days")}`;
    }
  }

  postContinue(value) {
    let motorPackageId = sessionStorage.getItem('motorPackageBuyId');
    sessionStorage.setItem('postId', value.id);
    sessionStorage.setItem('makeCarName', value.make);
    sessionStorage.setItem('modelCarName', value.model);
    this.authService.getPostedPost(value.id).subscribe(
      (res: any) => {
        this.mainCategId = res.data[0].mainMotorCategoryId;
        this.subCategId = res.data[0].motorCategoryId;
        this.subSubCategId = res.data[0].motorSubCategoryId;
        if (motorPackageId) {
          if (!(this.subCategId == null || this.subCategId == 0) && (this.subSubCategId == null || this.subSubCategId == 0)) {
            this.router.navigate([`/post-ad-motor/${this.mainCategId}/${this.subCategId}/description/${value.id}`]);
          } else if (!(this.subCategId == null || this.subCategId == 0) && !(this.subSubCategId == null || this.subSubCategId == 0)) {
            this.router.navigate([`/post-ad-motor/${this.mainCategId}/${this.subCategId}/${this.subSubCategId}/description/${value.id}`]);
          } else {
            this.router.navigate([`/post-ad-motor/${this.mainCategId}/description/${value.id}`]);
          }
        } else {
          if (!(this.subCategId == null || this.subCategId == 0) && (this.subSubCategId == null || this.subSubCategId == 0)) {
            this.router.navigate([`/motor_subscription/${this.mainCategId}/${this.subCategId}/${value.id}`]);
          } else if (!(this.subCategId == null || this.subCategId == 0) && !(this.subSubCategId == null || this.subSubCategId == 0)) {
            this.router.navigate([`/motor_subscription/${this.mainCategId}/${this.subCategId}/${this.subSubCategId}/${value.id}`]);
          } else {
            this.router.navigate([`/motor_subscription/${this.mainCategId}/${value.id}`]);
          }
        }
      })
  }

  editMotorPost(value) {
    sessionStorage.setItem('postId', value.id);
    sessionStorage.setItem('makeCarName', value.make);
    sessionStorage.setItem('modelCarName', value.model);
    if (!(value.motorCategoryId == null || value.motorCategoryId == 0) && (value.motorSubCategoryId == null || value.motorSubCategoryId == 0)) {
      this.router.navigate([`/post-ad-motor/${value.mainMotorCategoryId}/${value.motorCategoryId}/description/${value.id}`]);
    } else if (!(value.motorCategoryId == null || value.motorCategoryId == 0) && !(value.motorSubCategoryId == null || value.motorSubCategoryId == 0)) {
      this.router.navigate([`/post-ad-motor/${value.mainMotorCategoryId}/${value.motorCategoryId}/${value.motorSubCategoryId}/description/${value.id}`]);
    } else {
      this.router.navigate([`/post-ad-motor/${value.mainMotorCategoryId}/description/${value.id}`]);
    }
  }

  propertyPostContinue(id) {
    let propertyPackageId = sessionStorage.getItem('PropertyPackageBuyId');
    sessionStorage.setItem('propertyPostId', id);
    this.authService.getPostedPrpertyPost(id).subscribe(
      (res: any) => {
        this.mainCategId = res.data[0].categoryId;
        if (res.data[0].type == "RENT") {
          var type = "rent";
        } else if (res.data[0].type == "SALE") {
          var type = "sale";
        }
        if (propertyPackageId) {
          this.router.navigate([`/property-post-ad/${type}/${this.mainCategId}/description/${id}`]);
        } else {
          this.router.navigate([`/prop_subscription/${type}/${this.mainCategId}/${id}`]);
        }
      })
  }

  editPropety(value) {
    // console.log("Fef", value)
    if (value.type == "RENT") {
      var type = "rent";
    } else if (value.type == "SALE") {
      var type = "sale";
    }
    this.router.navigate([`/property-post-ad/${type}/${value.categoryId}/description/${value.id}`]);
  }

  deletePost(id) {
    this.authService.deletePost(id).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.authService.showToast('success', 'Post Deleted Successfully');
          this.ngOnInit();
        } else {
          this.authService.showToast('error', res.message)
        }
      });
  }

  deletePropertyPost(id) {
    this.authService.deletePropertyPost(id).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.authService.showToast('success', 'Post Deleted Successfully');
          this.ngOnInit();
        } else {
          this.authService.showToast('error', res.message)
        }
      });
  }

  renewMotorSubscription(id) {
    this.router.navigate([`/motor_subscription/${id}`]);
    // console.log("Fef",id)
  }

  renewPropertySubscription(id) {
    this.router.navigate([`/prop_subscription/${id}`]);
  }
}
