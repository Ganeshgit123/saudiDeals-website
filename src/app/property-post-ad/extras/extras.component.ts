import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-extras',
    templateUrl: './extras.component.html',
    styleUrls: ['./extras.component.css'],
    standalone: false
})
export class ExtrasComponent {
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
  specForm: FormGroup;
  specFormLand: FormGroup;
  subCateg: any;
  params: any;
  category: any;
  cateeName: any;
  updateStatusLevel = 3;
  apiformData: any;
  submitted = false;
  isEdit = false;
  getPostedData = [];
  propPostId: any;
  cateIDd: any;
  dir: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    public fb: FormBuilder, private toastr: ToastrService) {
    this.specForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(1500)]],
      furnished: [''],
      kitchen: [''],
      garage: [''],
      elevator: [''],
      waterSupply: [''],
      electricitySupply: [''],
    });
    this.specFormLand = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(1500)]],
      waterSupply: [''],
      electricitySupply: [''],
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
          this.getPostedData = res.data;
          this.getPostedData.forEach(element => {
            if (this.cateIDd != 7) {
              this.specForm = this.fb.group({
                description: [element.description, [Validators.required, Validators.maxLength(1500)]],
                furnished: element.furnished,
                kitchen: element.kitchen,
                garage: element.garage,
                elevator: element.elevator,
                waterSupply: element.waterSupply,
                electricitySupply: element.electricitySupply,
              });
            }
            if (this.cateIDd == 16) {
              this.specFormLand = this.fb.group({
                description: [element.description, [Validators.required, Validators.maxLength(1500)]],
                waterSupply: element.waterSupply,
                electricitySupply: element.electricitySupply,
              });
            }
          });
        })
    } else {
      this.isEdit = false;
    }
  }

  get specF() { return this.specForm.controls; }
  get specLandF() { return this.specFormLand.controls; }

  postproduct() {
    this.submitted = true;
    if (this.cateIDd != 7 && this.category == 'rent') {
      if (this.specForm.invalid) {
        return;
      }
      this.specForm.value.furnished = this.specForm.value.furnished == true ? 1 : 0;
      this.specForm.value.kitchen = this.specForm.value.kitchen == true ? 1 : 0;
      this.specForm.value.garage = this.specForm.value.garage == true ? 1 : 0;
      this.specForm.value.elevator = this.specForm.value.elevator == true ? 1 : 0;
      this.specForm.value.waterSupply = this.specForm.value.waterSupply == true ? 1 : 0;
      this.specForm.value.electricitySupply = this.specForm.value.electricitySupply == true ? 1 : 0;
      this.apiformData = this.specForm.value;
    }
    if (this.cateIDd == 16) {
      if (this.specFormLand.invalid) {
        return;
      }
      this.specFormLand.value.waterSupply = this.specFormLand.value.waterSupply == true ? 1 : 0;
      this.specFormLand.value.electricitySupply = this.specFormLand.value.electricitySupply == true ? 1 : 0;
      this.apiformData = this.specFormLand.value;
    }
    this.submitted = false;
    this.specForm.value.updateStatusLevel = this.updateStatusLevel;
    const postId = sessionStorage.getItem('propertyPostId');

    // console.log("fef", this.apiformData)
    this.authService.propertyPostLevelUpdate(this.apiformData, postId)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
          this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/summary/${this.propPostId}`]);
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }
  prevPage() {
    this.router.navigate([`/property-post-ad/${this.category}/${this.subCateg}/images-location/${this.propPostId}`]);
  }
}
