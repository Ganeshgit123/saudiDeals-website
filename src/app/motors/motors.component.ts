import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-motors',
  templateUrl: './motors.component.html',
  styleUrls: ['./motors.component.css'],
  standalone: false
})
export class MotorsComponent {
  countValue: any;
  recentMotors = [];
  yearArray = [];
  motorCategory = [];
  categArray = [];
  categActive: any;
  subCategArray = [];
  makesCarList = [];
  subCaategActive: any;
  subSubCategArray = [];
  subSubActive: any;
  subSubCateegId: any;
  proAgeValue: any;
  bedValue: any;
  bathValue: any;
  makeId: any;
  makeName: any;
  modelCarList = [];
  modelId: any;
  modelName: any;
  trimList = [];
  trimName: any;
  yearValue: any;
  provinceId: any;
  cityList = [];
  cityId: any;
  dir: any;
  provinceList = [];
  trimActive = false;
  modelActive = false;
  cityActive = false;
  recentMotorLength: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.yearArray = ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012',
      '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'];
    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.motorCategory = res.data;
      })

    this.authService.getMotorCount().subscribe(
      (res: any) => {
        this.countValue = res.data[0];
      })

    this.authService.getRecentMotors().subscribe(
      (res: any) => {
        let exipryCondition = res.data;
        this.recentMotors = exipryCondition.slice(0, 5);
        this.recentMotorLength = exipryCondition.length;
      })

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.categArray = res.data;
        this.categActive = 1;
        this.authService.getMotorSubCateg(this.categActive).subscribe(
          (res: any) => {
            const sortedByName = res.data.sort((a, b) => a.motorCategoriesName.localeCompare(b.motorCategoriesName));
            this.subCategArray = sortedByName;
          })
        if (this.categActive == 1) {
          this.authService.getCarMakes("CAR").subscribe(
            (res: any) => {
              const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
              this.makesCarList = sortedByName;
              // console.log("Fe",this.makesCarList)
            })
        }
      })
    // get All Provinces
    this.authService.getProvince().subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
        this.provinceList = sortedByName;
      })
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }


  motorFirstCateg(id) {
    this.categActive = id;
    this.authService.getMotorSubCateg(id).subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.motorCategoriesName.localeCompare(b.motorCategoriesName));
        this.subCategArray = sortedByName;
      })
    if (id == 1) {
      this.authService.getCarMakes("CAR").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
          this.makesCarList = sortedByName;
        })
    } else if (id == 2) {
      this.authService.getCarMakes("BIKE").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
          this.makesCarList = sortedByName;
        })
    }
  }

  motorSecondCateg(id) {
    this.subCaategActive = id;
    this.authService.getMotorSubSubCateg(id).subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.motorSubCategoriesName.localeCompare(b.motorSubCategoriesName));
        this.subSubCategArray = sortedByName;
        const length = this.subSubCategArray.length;
        if (length > 0) {
          this.subSubActive = true;
        }
      })
  }

  motorThirdCateg(id) {
    this.subSubCateegId = id;
  }

  ageClick(id) {
    this.proAgeValue = id;
  }

  bedValueClick(id) {
    this.bedValue = id;
  }

  bathClick(id) {
    this.bathValue = id;
  }

  makeClick(id) {
    if (!(id == '' || id == 'all')) {
      this.modelActive = true;
    } else {
      this.modelActive = false;
    }
    this.makeId = id;
    if (id !== 'all') {
      if (this.categActive == 1) {
        this.authService.getCarMakes("CAR").subscribe(
          (res: any) => {
            res.data.forEach((element: any) => {
              if (id == element.id) {
                this.makeName = element.name;
                this.authService.getCarModel(this.makeId, "CAR").subscribe(
                  (res: any) => {
                    const sortedByName = res.data.sort((a, b) => a.modelName.localeCompare(b.modelName));
                    this.modelCarList = sortedByName;
                  });
              }
            });
          })
      } else if (this.categActive == 2) {
        this.authService.getCarMakes("BIKE").subscribe(
          (res: any) => {
            res.data.forEach((element: any) => {
              if (id == element.id) {
                this.makeName = element.name;
                this.authService.getCarModel(this.makeId, "BIKE").subscribe(
                  (res: any) => {
                    const sortedByName = res.data.sort((a, b) => a.modelName.localeCompare(b.modelName));
                    this.modelCarList = sortedByName;
                  });
              }
            });
          })
      }
    } else {
      this.makeName = id;
    }
  }

  modelClick(id) {
    if (!(id == '' || id == 'all')) {
      this.trimActive = true;
    }
    else {
      this.trimActive = false;
    }
    this.modelId = id;
    if (id !== 'all') {
      if (this.categActive == 1) {
        this.authService.getCarModel(this.makeId, "CAR").subscribe(
          (res: any) => {
            res.data.forEach((element: any) => {
              if (id == element.id) {
                this.modelName = element.modelName;
                this.authService.getTrim(this.makeId, element.id).subscribe(
                  (res: any) => {
                    const sortedByName = res.data.sort((a, b) => a.enName.localeCompare(b.enName));
                    this.trimList = sortedByName;
                  })
              }
            });
          })
      }
    } else {
      this.modelName = id;
    }
  }

  trimClick(value) {
    this.trimName = value;
  }

  yearClick(value) {
    this.yearValue = value;
  }
  provinceClick(id) {
    if (!(id == '' || id == 'all')) {
      this.cityActive = true;
      if (id !== 'all') {
        this.provinceId = id;
        this.authService.getCity(id).subscribe(
          (res: any) => {
            const sortedByName = res.data.sort((a, b) => a.city.localeCompare(b.city));
            this.cityList = sortedByName;
          }
        );
      } else {
        this.provinceId = id;
      }
    } else {
      this.provinceId = id;
      this.cityActive = false;
    }
  }

  cityClick(value) {
    this.cityId = value;
  }

  searchValues() {
    sessionStorage.removeItem("filterHistory");
    const object = {
      mainMotorCategoryId: this.categActive ? this.categActive : '',
      motorCategoryId: this.subCaategActive ? this.subCaategActive : '',
      motorSubCategoryId: this.subSubCateegId ? this.subSubCateegId : '',
      make: this.makeName ? this.makeName : '',
      model: this.modelName ? this.modelName : '',
      trim: this.trimName ? this.trimName : '',
      startingYear: this.yearValue ? this.yearValue : '',
      provinceId: this.provinceId ? this.provinceId : '',
      cityId: this.cityId ? this.cityId : '',
    }
    sessionStorage.setItem('homeFilter', JSON.stringify(object));
    this.router.navigate([`/motors_filter/${this.categActive}`]);
    // console.log("serar", object)
  }
  boxClick(id) {
    sessionStorage.removeItem("filterHistory");
    const object = {
      mainMotorCategoryId: id,
      motorCategoryId: this.subCaategActive ? this.subCaategActive : '',
      motorSubCategoryId: this.subSubCateegId ? this.subSubCateegId : '',
      make: this.makeName ? this.makeName : '',
      model: this.modelName ? this.modelName : '',
      trim: this.trimName ? this.trimName : '',
      startingYear: this.yearValue ? this.yearValue : '',
      provinceId: this.provinceId ? this.provinceId : '',
      cityId: this.cityId ? this.cityId : '',
    }
    sessionStorage.setItem('homeFilter', JSON.stringify(object));
    this.router.navigate([`/motors_filter/${id}`]);
  }
}
