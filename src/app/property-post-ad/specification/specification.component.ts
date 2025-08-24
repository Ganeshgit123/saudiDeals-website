import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-specification',
    templateUrl: './specification.component.html',
    styleUrls: ['./specification.component.css'],
    standalone: false
})
export class SpecificationComponent {
  subCateg: any;
  params: any;
  category: any;
  cateeName: any;
  specsFormRent: FormGroup;
  specsFormSale: FormGroup;
  specsFormLandRent: FormGroup;
  specsFormLandSale: FormGroup;
  specsFormRentWare: FormGroup;
  submitted = false;
  noOfBedroo = 0;
  noOfBathroo = 0;
  noOfFloor = 0;
  updateStatusLevel = 1;
  apiformData: any;
  isEdit = false;
  getPostedData = [];
  propPostId: any;
  categIDd: any;
  dir: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    public fb: FormBuilder, private toastr: ToastrService) {
    this.specsFormRent = this.fb.group({
      rentalTerm: ['', [Validators.required]],
      noBedrooms: ['', [Validators.required]],
      noBathrooms: ['', [Validators.required]],
      noFloors: ['', [Validators.required]],
      noLivingRooms: ['', [Validators.required]],
      propertyAge: ['', [Validators.required]],
    });
    this.specsFormSale = this.fb.group({
      noBedrooms: ['', [Validators.required]],
      noBathrooms: ['', [Validators.required]],
      noFloors: ['', [Validators.required]],
      noLivingRooms: ['', [Validators.required]],
      propertyAge: ['', [Validators.required]],
    });
    this.specsFormLandRent = this.fb.group({
      rentalTerm: ['', [Validators.required]],
      propetyType: ['', [Validators.required]]
    });
    this.specsFormLandSale = this.fb.group({
      propetyType: ['', [Validators.required]]
    });
    // this.specsFormRentWare = this.fb.group({
    //   rentalTerm: ['', [Validators.required]]
    // });
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
              this.categIDd = element.id;
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
              this.categIDd = element.id;
              // console.log("tt",this.cateeName)
            }
          });
        })
    }

    if (this.propPostId != undefined) {
      this.isEdit = true;
      this.authService.getPostedPrpertyPost(this.propPostId).subscribe(
        (res: any) => {
          this.getPostedData = res.data;
          this.getPostedData.forEach(element => {
            if (this.category == 'rent' && !(this.categIDd == 5 || this.categIDd == 6 || this.categIDd == 7 || this.categIDd == 9)) {
              this.specsFormRent = this.fb.group({
                rentalTerm: [element.rentalTerm, [Validators.required]],
                noBedrooms: [element.noBedrooms, [Validators.required]],
                noBathrooms: [element.noBathrooms, [Validators.required]],
                noFloors: [element.noFloors, [Validators.required]],
                noLivingRooms: [element.noLivingRooms, [Validators.required]],
                propertyAge: [element.propertyAge, [Validators.required]],
              });
            } else if (this.category == 'sale' && !(this.categIDd == 14 || this.categIDd == 15 || this.categIDd == 16 || this.categIDd == 17)) {
              this.specsFormSale = this.fb.group({
                noBedrooms: [element.noBedrooms, [Validators.required]],
                noBathrooms: [element.noBathrooms, [Validators.required]],
                noFloors: [element.noFloors, [Validators.required]],
                noLivingRooms: [element.noLivingRooms, [Validators.required]],
                propertyAge: [element.propertyAge, [Validators.required]],
              });
            } else if ((this.categIDd == 14 || this.categIDd == 15 || this.categIDd == 16 || this.categIDd == 17) && this.category == 'sale') {
              this.specsFormLandSale = this.fb.group({
                propetyType: [element.propetyType, [Validators.required]],
              });
            } else if ((this.categIDd == 5 || this.categIDd == 6 || this.categIDd == 7 || this.categIDd == 9) && this.category == 'rent') {
              this.specsFormLandRent = this.fb.group({
                rentalTerm: [element.rentalTerm, [Validators.required]],
                propetyType: [element.propetyType, [Validators.required]],
              });
            // } else if (this.categIDd == 9 && this.category == 'rent') {
            //   this.specsFormRentWare = this.fb.group({
            //     rentalTerm: [element.rentalTerm, [Validators.required]],
            //   });
            }
          });
        })
    } else {
      this.isEdit = false;
    }
  }
  get specsRentF() { return this.specsFormRent.controls; }
  get specsSaleF() { return this.specsFormSale.controls; }
  get specsLandRentF() { return this.specsFormLandRent.controls; }
  get specsLandSaleF() { return this.specsFormLandSale.controls; }
  // get specsWareRentF() { return this.specsFormRentWare.controls; }

  onSubmitDescrip() {
    this.submitted = true;
    if ((this.category == 'rent') && !(this.categIDd == 5 || this.categIDd == 6 || this.categIDd == 7 || this.categIDd == 9)) {
      if (this.specsFormRent.invalid) {
        return;
      }
      this.apiformData = this.specsFormRent.value;
      this.apiformData.noBedrooms = String(this.apiformData.noBedrooms);
      this.apiformData.noBathrooms = String(this.apiformData.noBathrooms);
      this.apiformData.noFloors = String(this.apiformData.noFloors);
      this.apiformData.noLivingRooms = String(this.apiformData.noLivingRooms);
      this.apiformData.propertyAge = String(this.apiformData.propertyAge);
    } else if (this.category == 'sale' && !(this.categIDd == 14 || this.categIDd == 15 || this.categIDd == 16 || this.categIDd == 17)) {
      if (this.specsFormSale.invalid) {
        return;
      }
      this.apiformData = this.specsFormSale.value;
      this.apiformData.noBedrooms = String(this.apiformData.noBedrooms);
      this.apiformData.noBathrooms = String(this.apiformData.noBathrooms);
      this.apiformData.noFloors = String(this.apiformData.noFloors);
      this.apiformData.noLivingRooms = String(this.apiformData.noLivingRooms);
      this.apiformData.propertyAge = String(this.apiformData.propertyAge);
    } else if ((this.categIDd == 14 || this.categIDd == 15 || this.categIDd == 16 || this.categIDd == 17) && this.category == 'sale') {
      if (this.specsFormLandSale.invalid) {
        return;
      }
      this.apiformData = this.specsFormLandSale.value;
    } else if ((this.categIDd == 5 || this.categIDd == 6 || this.categIDd == 7 || this.categIDd == 9) && this.category == 'rent') {
      if (this.specsFormLandRent.invalid) {
        return;
      }
      this.apiformData = this.specsFormLandRent.value;
    // } else if (this.categIDd == 9 && this.category == 'rent') {
    //   if (this.specsFormRentWare.invalid) {
    //     return;
    //   }
    //   this.apiformData = this.specsFormRentWare.value;
    }
    this.submitted = false;
    this.apiformData.updateStatusLevel = this.updateStatusLevel;

    const postId = sessionStorage.getItem('propertyPostId');

    // console.log("fef", this.apiformData)
    this.authService.propertyPostLevelUpdate(this.apiformData, postId)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
          this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/images-location/${this.propPostId}`]);
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }

  prevPage() {
    this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/description/${this.propPostId}`]);
  }
}
