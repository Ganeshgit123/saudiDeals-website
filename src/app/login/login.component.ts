import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  loginForm !: FormGroup;
  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute, public fb: FormBuilder,
    public authService: ApiCallService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      countryCode: ['+966'],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{9}")]],
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.sendOTP(this.loginForm.value)
      .subscribe((res: any) => {
        if (res.success == true) {
          sessionStorage.setItem('mobileNumber', this.loginForm.value.mobileNumber);
          sessionStorage.setItem('countryCode', this.loginForm.value.countryCode);
          localStorage.setItem('SDmobileNum', this.loginForm.value.mobileNumber);
          this.loginForm.reset();
          this.router.navigate(['/otp']);
          this.toastr.success('Success', res.massage);
        } else {
          sessionStorage.setItem('mobileNumber', this.loginForm.value.mobileNumber);
          sessionStorage.setItem('countryCode', this.loginForm.value.countryCode);
          localStorage.setItem('SDmobileNum', this.loginForm.value.mobileNumber);
          this.toastr.error('Error', res.massage);
          this.router.navigate(['/sign-up']);
        }
      })
  }

}
