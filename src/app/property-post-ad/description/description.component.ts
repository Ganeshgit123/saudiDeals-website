import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.css'],
    standalone: false
})
export class DescriptionComponent {
  subCateg: any;
  params: any;
  category: any;
  cateeName: any;
  descriptionFormAppart: FormGroup;
  descriptionForm: FormGroup;
  submitted = false;
  phoneNo = localStorage.getItem('SDmobileNum');
  areaValue = 0;
  widthValue = 0;
  lengthValue = 0;
  streetLeng = 0;
  updateStatusLevel = 0;
  apiformData: any;
  isEdit = false;
  getPostedData: any;
  propPostId: any;
  cateIDd: any;
  dir: any;
  adminApprove: boolean = false;


  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    public fb: FormBuilder, private toastr: ToastrService) {
    this.descriptionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      areaInSqmt: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      widthInMtr: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      lengthInMtr: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      streetLength: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{2,8}")]],
      ownerType: ['', [Validators.required]],
    });

    this.descriptionFormAppart = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      areaInSqmt: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      streetLength: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{0,7}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{2,8}")]],
      ownerType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.category = params['categ'];
      this.subCateg = params['subCateg'];
      this.propPostId = params['id'];
    });

    if (this.category == 'rent') {
      this.authService.getPropertyCategory("RENT").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (this.subCateg == element.id) {
              this.cateeName = element.en_name;
              this.cateIDd = element.id;
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
              this.cateIDd = element.id;
              // console.log("tt",this.cateeName)
            }
          });
        })
    }

    if (this.propPostId != undefined) {
      this.isEdit = true;
      this.authService.getPostedPrpertyPost(this.propPostId).subscribe(
        (res: any) => {
          this.getPostedData = res.data[0];
          if (this.getPostedData?.isApprove == 1) {
            this.adminApprove = true;
          } else {
            this.adminApprove = false;
          }
          if (!(this.cateIDd == 1 || this.cateIDd == 10)) {
            // console.log("tttt",this.getPostedData.title)
            this.descriptionForm = this.fb.group({
              title: this.getPostedData.title,
              areaInSqmt: [this.getPostedData.areaInSqmt, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              widthInMtr: [this.getPostedData.widthInMtr, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              streetLength: [this.getPostedData.streetLength, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              lengthInMtr: [this.getPostedData.lengthInMtr, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              phoneNumber: this.getPostedData.phoneNumber,
              price: [this.getPostedData.price, [Validators.pattern("^[1-9][0-9]{2,8}")]],
              ownerType: this.getPostedData.ownerType,
            });
          }
          if ((this.cateIDd == 1 || this.cateIDd == 10)) {
            // console.log("ffff",this.getPostedData.title)
            this.descriptionFormAppart = this.fb.group({
              title: this.getPostedData.title,
              areaInSqmt: [this.getPostedData.areaInSqmt, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              streetLength: [this.getPostedData.streetLength, [Validators.pattern("^[1-9][0-9]{0,7}")]],
              phoneNumber: this.getPostedData.phoneNumber,
              price: [this.getPostedData.price, [Validators.pattern("^[1-9][0-9]{2,8}")]],
              ownerType: this.getPostedData.ownerType,
            });
          }
        });
    } else {
      this.isEdit = false;
    }
  }
  get descF() { return this.descriptionForm.controls; }
  get apartF() { return this.descriptionFormAppart.controls; }

  onSubmitDescrip() {
    this.submitted = true;

    if ((this.cateIDd == 1) || (this.cateIDd == 10)) {
      if (this.descriptionFormAppart.invalid) {
        return;
      }
      this.descriptionFormAppart.value.price = String(this.descriptionFormAppart.value.price);
      this.descriptionFormAppart.value.areaInSqmt = String(this.descriptionFormAppart.value.areaInSqmt);
      this.descriptionFormAppart.value.streetLength = String(this.descriptionFormAppart.value.streetLength);
      this.apiformData = this.descriptionFormAppart.value;
    } else if (!(this.cateIDd == 1) || (this.cateIDd == 10)) {
      if (this.descriptionForm.invalid) {
        return;
      }
      this.descriptionForm.value.price = String(this.descriptionForm.value.price);
      this.descriptionForm.value.areaInSqmt = String(this.descriptionForm.value.areaInSqmt);
      this.descriptionForm.value.widthInMtr = String(this.descriptionForm.value.widthInMtr);
      this.descriptionForm.value.lengthInMtr = String(this.descriptionForm.value.lengthInMtr);
      this.descriptionForm.value.streetLength = String(this.descriptionForm.value.streetLength);
      this.apiformData = this.descriptionForm.value;
    }
    this.submitted = false;
    this.apiformData.categoryId = parseInt(this.subCateg);
    if (this.category == "rent") {
      this.apiformData.type = "RENT";
    } else if (this.category == "sale") {
      this.apiformData.type = "SALE";
    }

    if (this.isEdit) {
      if (this.adminApprove) {
        this.authService.propertyPostLevelUpdate(this.apiformData, this.propPostId)
          .subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success', res.massage);
              sessionStorage.setItem('propertyPostId', res.result.id);
              this.router.navigate(['/']);
            } else {
              this.toastr.error('Error', res.massage);
            }
          })
      } else {
        this.apiformData.updateStatusLevel = this.updateStatusLevel;
        // console.log("eddit", this.apiformData)
        this.authService.propertyPostLevelUpdate(this.apiformData, this.propPostId)
          .subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success', res.massage);
              sessionStorage.setItem('propertyPostId', res.result.id);
              if (this.cateIDd != 17) {
                this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/specifications/${res.result.id}`]);
              } else {
                this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/images-location/${res.result.id}`]);
              }
            } else {
              this.toastr.error('Error', res.massage);
            }
          })
      }
    } else {
      this.apiformData.updateStatusLevel = this.updateStatusLevel;
      // console.log("NEW", this.apiformData)
      this.authService.propertyPostLevel1(this.apiformData)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            sessionStorage.setItem('propertyPostId', res.result.id);
            if (this.cateIDd != 17) {
              this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/specifications/${res.result.id}`]);
            } else {
              this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/images-location/${res.result.id}`]);
            }
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    }
  }
}
