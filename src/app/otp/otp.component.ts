import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.css'],
    standalone: false
})
export class OtpComponent {
  otpForm: FormGroup;
  otp: any;
  verify: any;
  placeAd: any;
  myAd: any;
  favAd: any;
  notify: any;
  adDetailsPage: any;
  favAdDetails: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public authService: ApiCallService, private toastr: ToastrService) {
  }
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  ngOnInit(): void {
    this.placeAd = sessionStorage.getItem('placeAd');
    this.myAd = sessionStorage.getItem('myAd');
    this.favAd = sessionStorage.getItem('myFavourite');
    this.notify = sessionStorage.getItem('notification');
    this.adDetailsPage = sessionStorage.getItem('adDetails');
    this.favAdDetails = JSON.parse(sessionStorage.getItem('favAdDetail'));
    // console.log("ger",this.favAdDetails)
  }

  onOtpChange(event: any) {
    this.otp = event;
  }

  submit() {
    // console.log("gsd")
    const object = {
      otp: Number(this.otp),
      mobileNumber: Number(sessionStorage.getItem('mobileNumber')),
      countryCode: sessionStorage.getItem('countryCode')
    }
    this.authService.verifyOTP(object)
      .subscribe((res: any) => {
        if (res.success == false) {
          // this.toastr.success('Success', res.massage);
          // sessionStorage.setItem('userId', res.data.id);
          localStorage.setItem('SDtoken', res.data.token);
          // sessionStorage.setItem('userType', res.data.userType);
          localStorage.setItem('saudiDealsUserId', res.data.id);
          localStorage.setItem('saudiDealsLoggedIn', ('true'));
          if (this.placeAd == 'true') {
            this.router.navigate(['/category']);
          } else if (this.myAd == 'true') {
            this.router.navigate(['/my_ads']);
          } else if (this.favAd == 'true') {
            this.router.navigate(['/my_favourite']);
          } else if (this.notify == 'true') {
            this.router.navigate(['/notifications']);
          } else if (this.adDetailsPage == 'true') {
            this.router.navigate([`/ad-details/${this.favAdDetails.category}/${Number(this.favAdDetails.adId)}`]);
          } else {
            this.router.navigate(['/']);
          }
          this.authService.getNotification().subscribe(
            (res: any) => {
              localStorage.setItem('SDnotifyOld', res.data.length)
            })
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }
}
