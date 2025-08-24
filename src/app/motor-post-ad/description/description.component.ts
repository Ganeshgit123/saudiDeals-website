import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css'],
  standalone: false
})
export class DescriptionComponent implements OnInit {
  subSubCategArray: any = [];
  params: any;
  subParams: any;
  subSubParams: any;
  cateeName: any;
  subCateeName: any;
  subSubcateeName: any;
  usedCarsForm: FormGroup;
  motorsForm: FormGroup;
  heavyEquipForm: FormGroup;
  boatsForm: FormGroup;
  submitted = false;
  updateStatusLevel = 0;
  makesCarList = [];
  modelCarList = [];
  trimList = [];
  apiformData: any;
  makeCarName: any;
  makeId: any;
  modelCarName: any;
  modelId: any;
  getPostedData: any;
  isEdit = false;
  idParams: any;
  makeBikeList = [];
  modelBikeList = [];
  makeBikeName: any;
  phoneNo = localStorage.getItem('SDmobileNum');
  dir: any;
  cateId: any;
  adminApprove: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    public fb: FormBuilder, private toastr: ToastrService) {
    this.usedCarsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      trim: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.pattern("^[0-9]{4}")]],
      kilometer: ['', [Validators.required, Validators.pattern("^[0-9]{0,6}")]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3,8}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
      regionalSpecs: ['', [Validators.required]],
    });
    this.motorsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.pattern("^[0-9]{4}")]],
      kilometer: ['', [Validators.required, Validators.pattern("^[0-9]{2,6}")]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3,8}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
      regionalSpecs: ['', [Validators.required]],
    });

    this.heavyEquipForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      year: ['', [Validators.required, Validators.pattern("^[0-9]{4}")]],
      kilometer: ['', [Validators.required, Validators.pattern("^[0-9]{2,6}")]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3,8}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
    });

    this.boatsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      age: ['', [Validators.required]],
      length: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern("^[1-9][0-9]{3,8}")]],
      phoneNumber: [this.phoneNo, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.params = params['categ'];
      this.subParams = params['subcateg'];
      this.subSubParams = params['subSubcateg'];
      this.idParams = params['id'];
    });

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.params == element.id) {
            if (this.dir == 'ltr') {
              this.cateeName = element.name;
            } else if (this.dir == 'rtl') {
              this.cateeName = element.arName;
            }
            this.cateId = element.id;
          }
        });
      })

    this.authService.getMotorSubCateg(this.params).subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.subParams == element.id) {
            if (this.dir == 'ltr') {
              this.subCateeName = element.motorCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subCateeName = element.arMotorCategoriesName;
            }
          }
        });
      })

    this.authService.getMotorSubSubCateg(this.subParams).subscribe(
      (res: any) => {
        this.subSubCategArray = res.data;
        res.data.forEach((element: any) => {
          if (this.subSubParams == element.id) {
            if (this.dir == 'ltr') {
              this.subSubcateeName = element.motorSubCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subSubcateeName = element.arMotorSubCategoriesName;
            }
          }
        });
      })

    if (this.params == 1) {
      this.authService.getCarMakes("CAR").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name?.localeCompare(b.name));
          this.makesCarList = sortedByName;
          this.makeCarName = sessionStorage.getItem('makeCarName');
          this.makesCarList.forEach((element: any) => {
            if (this.makeCarName == element.name) {
              this.makeId = element.id;
              this.authService.getCarModel(this.makeId, "CAR").subscribe(
                (res: any) => {
                  const sortedByName = res.data.sort((a, b) => a.name?.localeCompare(b.name));
                  this.modelCarList = sortedByName;
                  this.modelCarName = sessionStorage.getItem('modelCarName');
                  this.modelCarList.forEach((element: any) => {
                    if (this.modelCarName == element.modelName) {
                      this.modelId = element.id;
                      this.authService.getTrim(this.makeId, this.modelId).subscribe(
                        (res: any) => {
                          const sortedByName = res.data.sort((a, b) => a.enName?.localeCompare(b.enName));
                          this.trimList = sortedByName;
                        });
                    }
                  });
                });
            }
          });
        })
    } else if (this.params == 2) {
      this.authService.getBikeMakes("BIKE").subscribe(
        (res: any) => {
          this.makeBikeList = res.data;
          this.makeBikeName = sessionStorage.getItem('makeCarName');
          this.makeBikeList.forEach((element: any) => {
            if (this.makeBikeName == element.name) {
              this.makeId = element.id;
              this.authService.getBikeModel(this.makeId, "BIKE").subscribe(
                (res: any) => {
                  this.modelBikeList = res.data;
                  this.modelCarName = sessionStorage.getItem('modelCarName');
                  this.modelBikeList.forEach((element: any) => {
                    if (this.modelCarName == element.modelName) {
                      this.modelId = element.id;
                    }
                  })
                }
              );
            }
          });
        })
    }

    if (this.idParams != undefined) {
      this.isEdit = true;
      this.authService.getPostedPost(this.idParams).subscribe(
        (res: any) => {
          this.getPostedData = res.data[0];
          if (this.getPostedData?.isApprove == 1) {
            this.adminApprove = true;
          } else {
            this.adminApprove = false;
          }
          // console.log("fe",this.adminApprove)
          if (this.getPostedData.mainMotorCategoryId == 1) {
            this.usedCarsForm = this.fb.group({
              title: this.getPostedData.title,
              make: this.getPostedData.make,
              model: this.getPostedData.model,
              trim: this.getPostedData.trim,
              year: this.getPostedData.year,
              kilometer: this.getPostedData.kilometer,
              price: this.getPostedData.price,
              phoneNumber: this.getPostedData.phoneNumber,
              regionalSpecs: this.getPostedData.regionalSpecs,
            });
          } else if (this.getPostedData.mainMotorCategoryId == 2) {
            this.motorsForm = this.fb.group({
              title: this.getPostedData.title,
              make: this.getPostedData.make,
              model: this.getPostedData.model,
              year: this.getPostedData.year,
              kilometer: this.getPostedData.kilometer,
              price: this.getPostedData.price,
              phoneNumber: this.getPostedData.phoneNumber,
              regionalSpecs: this.getPostedData.regionalSpecs,
            });
          } else if (this.getPostedData.mainMotorCategoryId == 3) {
            this.heavyEquipForm = this.fb.group({
              title: this.getPostedData.title,
              year: this.getPostedData.year,
              kilometer: this.getPostedData.kilometer,
              price: this.getPostedData.price,
              phoneNumber: this.getPostedData.phoneNumber,
            });
          } else if (this.getPostedData.mainMotorCategoryId == 4) {
            this.boatsForm = this.fb.group({
              title: this.getPostedData.title,
              age: this.getPostedData.age,
              length: this.getPostedData.length,
              price: this.getPostedData.price,
              phoneNumber: this.getPostedData.phoneNumber,
            });
          }
        });
    } else {
      this.isEdit = false;
    }
  }
  get usedCarsf() { return this.usedCarsForm.controls; }
  get motorsf() { return this.motorsForm.controls; }
  get heavyf() { return this.heavyEquipForm.controls; }
  get boatf() { return this.boatsForm.controls; }

  onModelChange(data, value) {
    // console.log("fefe", value)
    if (value == 'CAR') {
      this.makeCarName = data;
      this.authService.getCarMakes("CAR").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (this.makeCarName == element.name) {
              this.makeId = element.id;
              this.authService.getCarModel(this.makeId, "CAR").subscribe(
                (res: any) => {
                  this.modelCarList = res.data;
                }
              );
            }
          });
        })
    } else {
      this.makeBikeName = data;
      this.authService.getBikeMakes("BIKE").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (this.makeBikeName == element.name) {
              this.makeId = element.id;
              this.authService.getBikeModel(this.makeId, "BIKE").subscribe(
                (res: any) => {
                  this.modelBikeList = res.data;
                }
              );
            }
          });
        })
    }
  }

  onTrimChange(data) {
    this.modelCarName = data;
    this.authService.getCarModel(this.makeId, "CAR").subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.modelCarName == element.modelName) {
            this.modelId = element.id;
            this.authService.getTrim(this.makeId, this.modelId).subscribe(
              (res: any) => {
                this.trimList = res.data;
              })
          }
        });
      })
  }

  onSubmitDescrip() {
    this.submitted = true;

    if (this.cateId == 1) {
      if (this.usedCarsForm.invalid) {
        return;
      }
      this.usedCarsForm.value.make = this.makeCarName;
      this.apiformData = this.usedCarsForm.value;
    } else if (this.cateId == 2) {
      if (this.motorsForm.invalid) {
        return;
      }
      this.usedCarsForm.value.make = this.makeBikeName;
      this.apiformData = this.motorsForm.value;
    } else if (this.cateId == 3) {
      if (this.heavyEquipForm.invalid) {
        return;
      }
      this.apiformData = this.heavyEquipForm.value;
    } else if (this.cateId == 4) {
      if (this.boatsForm.invalid) {
        return;
      }
      this.apiformData = this.boatsForm.value;
    }
    this.submitted = false;
    this.apiformData.mainMotorCategoryId = parseInt(this.params);
    if (this.subParams != undefined) {
      this.apiformData.motorCategoryId = parseInt(this.subParams);
    } else {
      this.apiformData.motorCategoryId = 0;
    }
    if (this.subSubParams != undefined) {
      this.apiformData.motorSubCategoryId = parseInt(this.subSubParams);
    } else {
      this.apiformData.motorSubCategoryId = 0;
    }

    if (this.isEdit) {
      if (this.adminApprove) {
        const postId = sessionStorage.getItem('postId');
        this.authService.motorPostLevelUpdate(this.apiformData, postId)
          .subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success', res.massage);
              sessionStorage.setItem('postId', res.result.id);
              sessionStorage.setItem('makeCarName', res.result.make);
              sessionStorage.setItem('modelCarName', res.result.model);
              this.router.navigate(['/']);
            } else {
              this.toastr.error('Error', res.massage);
            }
          })
      } else {
        // console.log("eddit", this.apiformData)
        const postId = sessionStorage.getItem('postId');
        this.apiformData.updateStatusLevel = this.updateStatusLevel;
        this.authService.motorPostLevelUpdate(this.apiformData, postId)
          .subscribe((res: any) => {
            if (res.success == true) {
              this.toastr.success('Success', res.massage);
              sessionStorage.setItem('postId', res.result.id);
              sessionStorage.setItem('makeCarName', res.result.make);
              sessionStorage.setItem('modelCarName', res.result.model);
              if (this.subParams != undefined && this.subSubParams == undefined) {
                this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/images-location/${res.result.id}`]);
              } else if (this.subParams != undefined && this.subSubParams != undefined) {
                this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/images-location/${res.result.id}`]);
              } else {
                this.router.navigate([`/post-ad-motor/${this.params}/images-location/${res.result.id}`]);
              }
            } else {
              this.toastr.error('Error', res.massage);
            }
          })
      }
    } else {
      // console.log("Add", this.apiformData)
      this.apiformData.updateStatusLevel = this.updateStatusLevel;
      this.authService.motorPostLevel1(this.apiformData)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            sessionStorage.setItem('postId', res.result.id);
            sessionStorage.setItem('makeCarName', res.result.make);
            sessionStorage.setItem('modelCarName', res.result.model);
            if (this.subParams != undefined && this.subSubParams == undefined) {
              this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/images-location/${res.result.id}`]);
            } else if (this.subParams != undefined && this.subSubParams != undefined) {
              this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/images-location/${res.result.id}`]);
            } else {
              this.router.navigate([`/post-ad-motor/${this.params}/images-location/${res.result.id}`]);
            }
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    }
  }
}
