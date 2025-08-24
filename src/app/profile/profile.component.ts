import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent {
  profileForm !: FormGroup;
  submitted = false;
  userId: any;
  userList: any = [];
  fileImgUpload: any;
  iconImg: any;
  profImage: any;

  constructor(private router: Router, private route: ActivatedRoute, public fb: FormBuilder, public authService: ApiCallService,
    private toastr: ToastrService,private spinner: NgxSpinnerService,private translate: TranslateService) {
    this.profileForm = this.fb.group({
      userName: [''],
      mobileNumber: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('saudiDealsUserId');

    this.authService.getUser().subscribe(
      (res: any) => {
        this.userList = res.userDetails[0];
        this.profImage = this.userList.image;
        this.profileForm = this.fb.group({
          userName: [this.userList.userName],
          mobileNumber: [this.userList.mobileNumber],
          email: [this.userList.email, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        });
      })

  }
  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    this.authService.profileUpdate(this.profileForm.value, this.userId)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }

  checkFileFormat(checkFile) {
    if (checkFile.type == 'image/webp' || checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff') {
      return false;
    } else {
      return true;
    }
  }

  uploadImageFile(event: any) {
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if (!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.iconImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.fileImgUpload = file;
    }
    this.spinner.show();
    var postData = new FormData();
    postData.append('image', this.fileImgUpload);
    this.authService.s3upload(postData).subscribe((res: any) => {
      if (res.success == true) {
        var updateImg = res.files[0].url;
        const data = this.profileForm.value;
            data['image'] = updateImg;
        this.authService.profileUpdate(data, this.userId)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            this.spinner.hide();
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
      }
    })
  }

  deleteAccount(){
    const object = { active: 0 }
    Swal.fire({
      title: this.translate.instant('Sure'),
      text: this.translate.instant('revert'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('yesDelete'),
      cancelButtonText: this.translate.instant('cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
          this.authService.profileDelete(object, this.userId)
            .subscribe((res: any) => {
              if (res.success == true) {
                Swal.fire(
                  {
                    title: this.translate.instant('deleted'),
                    text: this.translate.instant('accountConfirm'),
                    icon: "success",
                    confirmButtonText: this.translate.instant('ok'),
                  }),
                  this.router.navigate(['/']);
                  sessionStorage.clear();
                  localStorage.clear();
              } else {
                this.toastr.warning('Enter valid ', res.massage);
              }
            });
      }
    })
  }
}