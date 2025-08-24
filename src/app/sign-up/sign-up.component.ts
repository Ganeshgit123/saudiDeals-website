import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    standalone: false
})
export class SignUpComponent implements OnInit {
  params: any;
  signupForm !:FormGroup;
  submitted = false;
  errorMsg = false;
  msg:any;
  
  mobileNumber = sessionStorage.getItem('mobileNumber');
  constructor(private router: Router, private route: ActivatedRoute, public fb: FormBuilder, public authService: ApiCallService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.signupForm = this.fb.group({
      userName: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      countryCode: ['+966'],
      mobileNumber: [this.mobileNumber, [Validators.required, Validators.pattern("^[0-9]{9}")]],
      userType: ['DEALER']
    });
  }
  get signupF() { return this.signupForm.controls; }

  onSignUp() {
    this.errorMsg = false;
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }
    this.signupForm.value.userType = 'DEALER';
    this.submitted = false;
    this.authService.signUp(this.signupForm.value)
      .subscribe((res: any) => {
        if (res.success == true) {
          sessionStorage.setItem('mobileNumber',this.signupForm.value.mobileNumber);
          sessionStorage.setItem('countryCode',this.signupForm.value.countryCode);
          localStorage.setItem('SDmobileNum', this.signupForm.value.mobileNumber);
          this.signupForm.reset();
          this.router.navigate(['/otp']);
          this.toastr.success('Success', res.massage);
        } else {
          // this.toastr.error('Error', res.massage);
          this.errorMsg = true;
          this.msg = res.massage;
        }
      })
  }
}
