import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-specs',
    templateUrl: './specs.component.html',
    styleUrls: ['./specs.component.css'],
    standalone: false
})
export class SpecsComponent {
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      translate: 'yes',
      enableToolbar: false,
      showToolbar: false,
      sanitize: true,
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'poppins', name: 'Poppins' }
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};
  subSubCategArray: any = [];
  params: any;
  subParams: any;
  cateeName: any;
  subCateeName: any;
  subSubParams: any;
  subSubcateeName: any;
  usedCarsForm: FormGroup;
  motorsForm: FormGroup;
  heavyEquipForm: FormGroup;
  boatsForm: FormGroup;
  submitted = false;
  updateStatusLevel = 2;
  apiformData: any;
  extraList = [];
  getPostedData = [];
  idParams: any;
  cateId: any;
  dir:any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    public fb: FormBuilder, private toastr: ToastrService) {
    this.usedCarsForm = this.fb.group({
      bodyType: ['', [Validators.required]],
      transmissionType: ['', [Validators.required]],
      cylinders: ['', [Validators.required]],
      exteriorColor: ['', [Validators.required]],
      interiorColor: ['', [Validators.required]],
      // extra: new FormArray([]),
      description: ['', [Validators.required,Validators.maxLength(1500)]],
      leatherSeat: [''],
      parkingSensor: [''],
      rearViewCamera: [''],
      sunRoof: [''],
      accidentFree: [''],
      warranty: [''],
      fullyMaintained: [''],
    });

    this.motorsForm = this.fb.group({
      finalDriveSystem: ['', [Validators.required]],
      wheels: ['', [Validators.required]],
      engineSize: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.maxLength(1500)]],
    });

    this.heavyEquipForm = this.fb.group({
      bodyCondition: ['', [Validators.required]],
      mechanicalCondition: ['', [Validators.required]],
      cylinders: ['', [Validators.required]],
      horsePower: ['', [Validators.required]],
      capacity: [''],
      description: ['', [Validators.required,Validators.maxLength(1500)]],
    });

    this.boatsForm = this.fb.group({
      bodyCondition: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.maxLength(1500)]],
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
            if(this.dir == 'ltr'){
              this.subCateeName = element.motorCategoriesName;
            }else if(this.dir == 'rtl'){
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
            if(this.dir == 'ltr'){
              this.subSubcateeName = element.motorSubCategoriesName;
            }else if(this.dir == 'rtl'){
              this.subSubcateeName = element.arMotorSubCategoriesName;
            }
          }
        });
      })

    // this.extraList = [{ selected: false, value: 'Leather Seat', label: 'Leather Seat' }, { selected: false, value: 'Parking Sensor', label: 'Parking Sensor' },
    // { selected: false, value: 'Rear View Camera', label: 'Rear View Camera' }, { selected: false, value: '4 Wheel Drive', label: '4 Wheel Drive' },
    // { selected: false, value: 'Sunroof', label: 'Sunroof' }];

    const postId = sessionStorage.getItem('postId');
    if (postId != null) {
      this.authService.getPostedPost(postId).subscribe(
        (res: any) => {
          this.getPostedData = res.data;
          this.getPostedData.forEach(element => {
            if (element.mainMotorCategoryId == 1) {
              this.usedCarsForm = this.fb.group({
                bodyType: [element.bodyType, Validators.required],
                transmissionType: [element.transmissionType, Validators.required],
                cylinders: [element.cylinders, Validators.required],
                exteriorColor: [element.exteriorColor, Validators.required],
                interiorColor: [element.interiorColor, Validators.required],
                // extra: new FormArray([]),
                description: [element.description, [Validators.required,Validators.maxLength(1500)]],
                leatherSeat: element.leatherSeat,
                parkingSensor: element.parkingSensor,
                rearViewCamera: element.rearViewCamera,
                sunRoof: element.sunRoof,
                accidentFree: element.accidentFree,
                warranty: element.warranty,
                fullyMaintained: element.fullyMaintained,
              });
            } else if (element.mainMotorCategoryId == 2) {
              this.motorsForm = this.fb.group({
                finalDriveSystem: [element.finalDriveSystem, Validators.required],
                wheels: [element.wheels, Validators.required],
                engineSize: [element.engineSize, Validators.required],
                description: [element.description, [Validators.required,Validators.maxLength(1500)]],
              });
            } else if (element.mainMotorCategoryId == 3) {
              this.heavyEquipForm = this.fb.group({
                bodyCondition: [element.bodyCondition, Validators.required],
                mechanicalCondition: [element.mechanicalCondition, Validators.required],
                cylinders: [element.cylinders, Validators.required],
                horsePower: [element.horsePower, Validators.required],
                capacity: [element.capacity],
                description: [element.description, [Validators.required,Validators.maxLength(1500)]],
              });
            } else if (element.mainMotorCategoryId == 4) {
              this.boatsForm = this.fb.group({
                bodyCondition: [element.bodyCondition, Validators.required],
                description: [element.description, [Validators.required,Validators.maxLength(1500)]],
              });
            }
          });
        })
    }
  }

  get usedCarsf() { return this.usedCarsForm.controls; }
  get motorsf() { return this.motorsForm.controls; }
  get heavyf() { return this.heavyEquipForm.controls; }
  get boatf() { return this.boatsForm.controls; }

  extraChange(event: any, item) {
    const selectedvalues = (this.usedCarsForm.controls['extra'] as FormArray);
    if (event.source.checked) {
      selectedvalues.push(new FormControl(item.value));
    } else {
      const index = selectedvalues.controls
        .findIndex(x => x.value === item.value);
      selectedvalues.removeAt(index);
    }
  }

  extraMotorChange(event: any, item) {
    const selectedvalues = (this.motorsForm.controls['extra'] as FormArray);
    if (event.source.checked) {
      selectedvalues.push(new FormControl(item.value));
    } else {
      const index = selectedvalues.controls
        .findIndex(x => x.value === item.value);
      selectedvalues.removeAt(index);
    }
  }
  onSubmitSpecs() {
    this.submitted = true;
    if (this.cateId == 1) {
      if (this.usedCarsForm.invalid) {
        return;
      }
      this.usedCarsForm.value.leatherSeat = this.usedCarsForm.value.leatherSeat == true ? 1 : 0;
      this.usedCarsForm.value.parkingSensor = this.usedCarsForm.value.parkingSensor == true ? 1 : 0;
      this.usedCarsForm.value.rearViewCamera = this.usedCarsForm.value.rearViewCamera == true ? 1 : 0;
      this.usedCarsForm.value.sunRoof = this.usedCarsForm.value.sunRoof == true ? 1 : 0;
      this.usedCarsForm.value.accidentFree = this.usedCarsForm.value.accidentFree == true ? 1 : 0;
      this.usedCarsForm.value.warranty = this.usedCarsForm.value.warranty == true ? 1 : 0;
      this.usedCarsForm.value.fullyMaintained = this.usedCarsForm.value.fullyMaintained == true ? 1 : 0;
      this.apiformData = this.usedCarsForm.value;
      // this.apiformData.extra = JSON.stringify(this.usedCarsForm.value.extra);
    } else if (this.cateId == 2) {
      if (this.motorsForm.invalid) {
        return;
      }
      this.apiformData = this.motorsForm.value;
      // this.apiformData.extra = JSON.stringify(this.motorsForm.value.extra);
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
    this.apiformData.updateStatusLevel = this.updateStatusLevel;

    const postId = sessionStorage.getItem('postId');
    // console.log("fef", this.apiformData)
    this.authService.motorPostLevelUpdate(this.apiformData, postId)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
          if (this.subParams != undefined && this.subSubParams == undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/summary/${this.idParams}`]);
          } else if (this.subParams != undefined && this.subSubParams != undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/summary/${this.idParams}`]);
          } else {
            this.router.navigate([`/post-ad-motor/${this.params}/summary/${this.idParams}`]);
          }
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }

  prevPost() {
    if (this.subParams != undefined && this.subSubParams == undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/images-location/${this.idParams}`]);
    } else if (this.subParams != undefined && this.subSubParams != undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/images-location/${this.idParams}`]);
    } else {
      this.router.navigate([`/post-ad-motor/${this.params}/images-location/${this.idParams}`]);
    }
  }
}
