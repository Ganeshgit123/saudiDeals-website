import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: false
})
export class ContactComponent {
  contactForm !: FormGroup;
  submitted = false;
  iconImg = null;
  fileImgUpload: any;
  fileUpload: any;

  constructor(private router: Router, private route: ActivatedRoute, public fb: FormBuilder, public authService: ApiCallService,
    private toastr: ToastrService, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {

    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{9}")]],
      message: ['', [Validators.required]],
      attachment: ['']
    });
  }
  get contF() { return this.contactForm.controls; }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'application/pdf') {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.fileUpload = event.target.result;
      }
      this.fileImgUpload = file;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.fileImgUpload) {
      var postData = new FormData();
      postData.append('image', this.fileImgUpload);
      this.authService.s3upload(postData).subscribe((res: any) => {
        if (res.success == true) {
          var updateImg = res.files[0].url;
          const data = this.contactForm.value;
          this.contactForm.value.mobileNumber = String(this.contactForm.value.mobileNumber);
          data['attachment'] = updateImg;
          // console.log("add", data)
          this.authService.sendContactData(data)
            .subscribe((res: any) => {
              if (res.success == true) {
                this.toastr.success('Success ', res.massage);
                this.spinner.hide();
                this.submitted = false;
                this.iconImg = null;
                this.contactForm.reset();
                this.ngOnInit();
              } else {
                this.toastr.error('Enter valid ', res.massage);
              }
            });
        }
      });
    } else {
      const data = this.contactForm.value;
      this.contactForm.value.mobileNumber = String(this.contactForm.value.mobileNumber);
      // console.log("add", data)
      this.authService.sendContactData(data)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success ', res.massage);
            this.spinner.hide();
            this.submitted = false;
            this.iconImg = null;
            this.contactForm.reset();
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.massage);
          }
        });
    }

  }
}
