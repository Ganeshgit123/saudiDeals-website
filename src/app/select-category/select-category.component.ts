import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { end } from '@popperjs/core';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-select-category',
    templateUrl: './select-category.component.html',
    styleUrls: ['./select-category.component.css'],
    standalone: false
})
export class SelectCategoryComponent {
  subscriptionList = [];
  activePackage = false;
  subsLength:any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,) { }

  ngOnInit(): void {
  }

  motorClick() {
    this.authService.getSubscriptionList().subscribe(
      (res: any) => {
        this.subscriptionList = res.data.filter(element => {
          return element.type === 'MOTOR' && element.remainingPost != 0;
        })
        this.subsLength = this.subscriptionList.length;
        if(this.subsLength == 0){
          this.router.navigate([`/motor_subscription/`]);
        }else{
          this.router.navigate([`/motor_category/`]);
        }
      })
  }

  propertyClick(){
    this.authService.getSubscriptionList().subscribe(
      (res: any) => {
        this.subscriptionList = res.data.filter(element => {
          return element.type === 'PROPERTY' && element.remainingPost != 0;
        })
        this.subsLength = this.subscriptionList.length;
        if(this.subsLength == 0){
          this.router.navigate([`/prop_subscription/`]);
        }else{
          this.router.navigate([`/main_property/`]);
        }
      })
  }
}
