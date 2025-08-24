import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { PlatformLocation } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent {
  popularRentProducts = [];
  loggedUser: any;
  viewedMotors = [];
  viewedProperty = [];
  popularMotorProducts = [];
  showMotorCategory = false;
  categArray = [];
  subCategArray = [];
  categActive: any;
  subSubCategArray = [];
  subCaategActive: any;
  subCateLength: any;
  subSubCateLength: any;
  makesCarList = [];
  modelCarList = [];
  motorCategory = [];
  dir: any;
  rentCategory = [];
  saleCategory = [];
  totalLength: any;
  makeId: any;
  trimList = [];
  yearArray = [];
  provinceList = [];
  cityList = [];
  makeName: any;
  modelId: any;
  modelName: any;
  trimName: any;
  yearValue: any;
  provinceId: any;
  cityId: any;
  subSubCateegId: any;
  subSubActive = false;
  topMotor = false;
  topProperty = false;
  propSecondCategActive: any;
  progCategArray = [];
  propCategValue: any;
  bedNumber = [];
  propAgeArray = [];
  bathArray = [];
  proTermValue: any;
  bedValue: any;
  bathValue: any;
  trimActive = false;
  modelActive = false;
  cityActive = false;
  rentalTermArray = [];
  viewedMotorLength: number = 0;
  viewedPropertyLength: number = 0;
  popularMotorLength: number = 0;
  popularPropertyLength: number = 0;
  selectedMakes = [];
  searchText: string = '';

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, private platformLocation: PlatformLocation) {
    history.pushState(null, '', location.href);
    this.platformLocation.onPopState(() => {
      history.pushState(null, '', location.href);
    })
  }

  ngOnInit(): void {
    this.authService.getNotification().subscribe(
      (res: any) => {
        localStorage.setItem('SDnotifyNew', res.data.length)
      })
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    this.loggedUser = localStorage.getItem('saudiDealsLoggedIn');
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.topMotor = true;
    this.yearArray = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012',
      '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'];
    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.motorCategory = res.data;
      })

    // get All Provinces
    this.authService.getProvince().subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
        this.provinceList = sortedByName;
      })

    this.authService.getPropertyCategory("RENT").subscribe(
      (res: any) => {
        this.rentCategory = res.data.slice(0, 4);
      })

    this.authService.getPropertyCategory("SALE").subscribe(
      (res: any) => {
        this.saleCategory = res.data.slice(0, 4);
      })

    if (this.loggedUser == 'true') {
      this.authService.getHomeDataWithUserId().subscribe(
        (res: any) => {
          if (res?.viewedProducts.length) {
            if (res?.viewedProducts[0]) {
              var checkLength = res?.viewedProducts[0].data;
              this.viewedMotorLength = checkLength.length;
            }
            if (res?.viewedProducts[1]) {
              var checkLength = res?.viewedProducts[1].data;
              this.viewedPropertyLength = checkLength.length;
            }
          }
          if (res?.popularProducts.length) {
            if (res?.popularProducts[0]) {
              var checkLength = res?.popularProducts[0].data;
              this.popularMotorLength = checkLength.length;
            }
            if (res?.popularProducts[1]) {
              var checkLength = res?.popularProducts[1].data;
              this.popularPropertyLength = checkLength.length;
            }
          }
          // this.popularMotorProducts = res?.popularProducts[0]?.data.slice(0, 6);
          this.popularMotorProducts = res?.popularProducts[0]?.data.slice(0, 6);
          this.popularRentProducts = res?.popularProducts[1]?.data.slice(0, 6);
          let viewedUniqueMotors = res?.viewedProducts[0]?.data.filter((obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id)
          );
          if (viewedUniqueMotors) {
            this.viewedMotors = viewedUniqueMotors.slice(0, 6);
          }
          let viewedUniqueProperty = res?.viewedProducts[1]?.data.filter((obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id)
          );
          if (viewedUniqueProperty) {
            this.viewedProperty = viewedUniqueProperty.slice(0, 6);
          }
        })
    } else {
      this.authService.getHomeDataWithoutUserId().subscribe(
        (res: any) => {
          if (res?.popularProducts.length) {
            if (res?.popularProducts[0]) {
              this.popularMotorLength = res?.popularProducts[0].length;
            } else if (res?.popularProducts[1]) {
              this.popularPropertyLength = res?.popularProducts[1].length;
            }
          }
          this.popularMotorProducts = res?.popularProducts[0]?.data.slice(0, 6);
          this.popularRentProducts = res?.popularProducts[1]?.data.slice(0, 6);
        })
    }

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        const swap = (start, end, arr) =>
          [].concat(
            arr.slice(0, start),
            arr.slice(end, end + 1),
            arr.slice(start + 1, end),
            arr.slice(start, start + 1)
          )
        this.categArray = swap(2, 3, res.data)
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
              this.selectedMakes = this.makesCarList;
              // console.log("Fe",this.makesCarList)
            })
        }
      })
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }

  topCateg(data) {
    if (data == 'Motor') {
      this.topMotor = true;
      this.topProperty = false;
    } else if (data == 'Property') {
      this.topProperty = true;
      this.topMotor = false;
      this.propSecondCategActive = 'rent';
      this.authService.getPropertyCategory(this.propSecondCategActive).subscribe(
        (res: any) => {
          this.progCategArray = res.data;
        })
      this.bedNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      this.propAgeArray = [{ label: 'below12Years', value: 'below 1-2 years' }, { label: '35Years', value: '3-5 years' },
      { label: '610Years', value: '6-10 years' }, { label: '10Years', value: '10+ Years' }];
      this.bathArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      this.rentalTermArray = [{ label: 'Daily', value: 'Daily' }, { label: 'Monthly', value: 'Monthly' },
      { label: 'Yearly', value: 'Yearly' }];
    }
  }

  onMakeKey(event) {
    this.selectedMakes = this.makeSearch(event.target.value);
  }

  makeSearch(value: string) {
    let filter = value.toLowerCase();
    return this.makesCarList.filter(option =>
      option.name.toLowerCase().startsWith(filter)
    );
  }

  propCategActive(data) {
    this.propSecondCategActive = data;
    this.authService.getPropertyCategory(this.propSecondCategActive).subscribe(
      (res: any) => {
        this.progCategArray = res.data;
      })
  }

  propCategSelect(id) {
    this.propCategValue = id;
  }

  motorClick() {
    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        this.categArray = res.data;
      })
    this.showMotorCategory = true;
  }

  motorFirstCateg(id) {
    this.categActive = id;
    this.subCaategActive = '';
    this.subSubCateegId = '';
    this.subSubActive = false;
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
          this.selectedMakes = this.makesCarList;
        })
    } else if (id == 2) {
      this.authService.getCarMakes("BIKE").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
          this.makesCarList = sortedByName;
          this.selectedMakes = this.makesCarList;
        })
    }
  }

  motorSecondCateg(id) {
    this.subCaategActive = id;
    this.subSubCateegId = '';
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

  termClick(id) {
    this.proTermValue = id;
  }

  bedValueClick(id) {
    this.bedValue = id;
  }

  bathClick(id) {
    this.bathValue = id;
  }

  makeClick(id) {
    if (id == '') {
      this.modelActive = false;
    } else if (id == 'all') {
      this.modelActive = false;
    } else {
      this.modelActive = true;
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
    if (id == '') {
      this.trimActive = false;
    } else if (id == 'all') {
      this.trimActive = false;
    } else {
      this.trimActive = true;
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
    if (id == '') {
      this.cityActive = false;
    } else if (id == 'all') {
      this.cityActive = false;
      this.provinceId = id;
    } else {
      this.cityActive = true;
      if (id !== 'all') {
        this.provinceId = id;
        this.authService.getCity(id).subscribe(
          (res: any) => {
            const sortedByName = res.data.sort((a, b) => a.city.localeCompare(b.city));
            this.cityList = sortedByName;
          });
      } else {
        this.provinceId = id;
      }
    }
  }

  cityClick(value) {
    this.cityId = value;
  }

  searchValues() {
    if (this.categActive == 1) {
      this.subCaategActive = '';
    }
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

  propertySearch() {
    const object = {
      categoryId: this.propCategValue ? this.propCategValue : '',
      provinceId: this.provinceId ? this.provinceId : '',
      cityId: this.cityId ? this.cityId : '',
      rentalTerm: this.proTermValue ? this.proTermValue : '',
      noBedrooms: this.bedValue ? this.bedValue : '',
      noBathrooms: this.bathValue ? this.bathValue : '',
    }
    sessionStorage.setItem('homeFilter', JSON.stringify(object));
    if (this.propCategValue) {
      this.router.navigate([`/property_filter/${this.propSecondCategActive}/${this.propCategValue}`]);
    } else {
      this.router.navigate([`/property_filter/${this.propSecondCategActive}`]);
    }
  }

  recentMotClick(id) {
    const data = {
      productId: id
    }
    if (this.loggedUser == 'true') {
      this.authService.recentMotorClick(data).subscribe((res: any) => {
        if (res.success == true) {
          this.router.navigate([`/ad-details/motors/${id}`]);
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
    } else {
      this.router.navigate([`/ad-details/motors/${id}`]);
    }
  }

  recentPropertyClick(id) {
    const data = {
      productId: id
    }
    if (this.loggedUser == 'true') {
      this.authService.recentPropClick(data).subscribe((res: any) => {
        if (res.success == true) {
          this.router.navigate([`/ad-details/property/${id}`]);
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
    } else {
      this.router.navigate([`/ad-details/property/${id}`]);
    }
  }

}
