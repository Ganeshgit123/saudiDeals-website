import { Component, HostListener, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
declare const google: any;
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-motor-filters',
  templateUrl: './motor-filters.component.html',
  styleUrls: ['./motor-filters.component.css'],
  standalone: false
})
export class MotorFiltersComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  private onStableSub!: Subscription;

  makesCarList = [];
  selectedMakes = [];
  dir: any;
  params: any;
  cateeName: any;
  postList = [];
  postListCount: any;
  modelCarList = [];
  makeName: any;
  selectedModel = [];
  modelName: any;
  modelOpen = false;
  trimOpen = false;
  trimList = [];
  selectedTrim = [];
  makeId: any;
  modelId: any;
  trimName: any;
  cityOpen: any;
  provinceList = [];
  selectedProvince = [];
  provinceSelect: any;
  cityList = [];
  selectedCity = [];
  cityId: any;
  filterSecShow = false;
  priceStartValue: any;
  priceEndValue: any;
  showDropdown = false;
  yearShowDropDown = false;
  yearStartValue: any;
  yearEndValue: any;
  kiloDropDown: any;
  kiloMeterStartValue: any;
  kiloMeterEndValue: any;
  warrantyInfo = [];
  specsInfo = [];
  warrantyClickInfo: any;
  specsInfoValue: any;
  bodyTypes = []; kiloRangeSelect
  bodyTypeValue: any;
  transmissionTypes = [];
  transMissionValue: any;
  interiorColor = [];
  interiorColorValue: any;
  exteriorColor = [];
  exteriorValue: any;
  cylinderArray = [];
  clinderClickValue: any;
  clearFiltBtn = false;
  sortShow = false;
  sortArray = [];
  sortedValue: any;
  finalDriveArray = [];
  finalDriveValue: any;
  wheelsArray = [];
  wheelSelectValue: any;
  engineSizeArray = [];
  engineSelectValue: any;
  subCategArray = [];
  selecteMotorCateg = [];
  subCategId: any;
  subSubCategList = [];
  subsubCategId: any;
  selectedSubCateg = [];
  subSubCategDropOpen: any;
  horsePowerArray = [];
  horsepowerSelectValue: any;
  boatLengthArray = [];
  yearArray = [];
  boatLgthSelectValue: any;
  homeMotorData: any;
  mainCategId: any;
  sortKey: any;
  sortOrder: any;
  yearSelect: any;
  priceRangeList: { label: SafeHtml; value: string | number }[] = [];
  kiloRangeList = [];
  priceSelect: any;
  kiloRangevalue: any;
  mapFilterShow = false;
  map: any;
  markers: any[] = [];
  yearDropDownval: any;
  page: number = 1;
  tableSize: number = 10;
  totalPostCount: any;
  sessionHistory: any;

  constructor(public authService: ApiCallService,
    private translate: TranslateService, private currencyPipe: CurrencyPipe, private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const riyalImg = '<img src="assets/images/saudi_riyal_logo.svg" style="width:11px;">&nbsp;';
    const sessionHome = JSON.parse(sessionStorage.getItem('homeFilter'));
    this.sessionHistory = JSON.parse(sessionStorage.getItem('filterHistory'));

    if (sessionHome) {
      this.homeMotorData = JSON.parse(sessionStorage.getItem('homeFilter'));
    } else if (this.sessionHistory) {
      this.homeMotorData = JSON.parse(sessionStorage.getItem('filterHistory'));
    }
    if (this.homeMotorData) {
      this.mainCategId = Number(this.homeMotorData.mainMotorCategoryId);
      this.subCategId = Number(this.homeMotorData.motorCategoryId) ? Number(this.homeMotorData.motorCategoryId) : '';
      if (this.homeMotorData.motorCategoryId) {
        this.onMotorCategChange(this.subCategId)
      }
      this.subsubCategId = Number(this.homeMotorData.motorSubCategoryId) ? Number(this.homeMotorData.motorSubCategoryId) : '';
      if (this.homeMotorData.make) {
        if (this.homeMotorData.make == 'all') {
          this.makeName = 'all';
        } else {
          this.makeName = this.homeMotorData.make ? this.homeMotorData.make : '';
          if (this.homeMotorData.make) {
            this.modelOpen = true;
            this.authService.getCarMakes("CAR").subscribe(
              (res: any) => {
                this.selectedMakes = res.data.sort((a, b) => a.name.localeCompare(b.name));
                res.data.forEach((element: any) => {
                  if (this.makeName === element.name) {
                    this.makeId = element.id;
                    this.authService.getCarModel(this.makeId, "CAR").subscribe(
                      (res: any) => {
                        this.modelCarList = res.data.sort((a, b) => a.modelName.localeCompare(b.modelName));
                        this.selectedModel = this.modelCarList;
                        res.data.forEach((element: any) => {
                          if (this.modelName == element.modelName) {
                            this.modelId = element.id;
                            this.authService.getTrim(this.makeId, element.id).subscribe(
                              (res: any) => {
                                this.trimList = res.data.sort((a, b) => a.enName.localeCompare(b.enName));;
                                this.selectedTrim = this.trimList;
                              })
                          }
                        });
                      });
                  }
                });
              })
            if (this.homeMotorData.model == 'all') {
              this.modelName = 'all';
            } else {
              this.modelName = this.homeMotorData.model ? this.homeMotorData.model : '';
            }
          }
        }
      } else {
        this.makeName = '';
        this.modelName = '';
      }
      if (this.homeMotorData.model) {
        if (this.homeMotorData.trim == 'all') {
          this.trimOpen = true;
          this.trimName = 'all';
        } else {
          this.trimName = this.homeMotorData.trim ? this.homeMotorData.trim : '';
          if (this.homeMotorData.model == 'all') {
            this.trimOpen = false;
          } else {
            this.trimOpen = true;
          }
        }
      } else {
        this.trimName = '';
      }
      if (this.homeMotorData.provinceId) {
        if (this.homeMotorData.provinceId == "all") {
          this.provinceSelect = 'all';
          this.cityOpen = false;
        } else {
          this.cityOpen = true;
          this.provinceSelect = Number(this.homeMotorData.provinceId) ? Number(this.homeMotorData.provinceId) : '';
          this.authService.getCity(this.provinceSelect).subscribe(
            (res: any) => {
              this.cityList = res.data.sort((a, b) => a.city.localeCompare(b.city));
              this.selectedCity = this.cityList;
            });

        }
      }

      if (this.homeMotorData.provinceId == 'all') {
        this.provinceSelect = 'all';
      } else {
        this.provinceSelect = Number(this.homeMotorData.provinceId) ? Number(this.homeMotorData.provinceId) : '';
      }
      if (this.homeMotorData.cityId == 'all') {
        this.cityId = 'all';
      } else {
        this.cityId = Number(this.homeMotorData.cityId) ? Number(this.homeMotorData.cityId) : '';
      }

      if (this.subCategId) {
        if (this.subCategId == 'all') {
          this.subCategId = 'all';
          var subCateGNNNN = '';
        } else {
          subCateGNNNN = this.subCategId;
        }
      } else {
        subCateGNNNN = this.subCategId ? this.subCategId : '';
      }
      if (this.makeName) {
        if (this.makeName == 'all') {
          this.makeName = 'all';
          var makeNN = ''
        } else {
          makeNN = this.makeName
        }
      } else {
        makeNN = this.makeName ? this.makeName : '';
      }

      if (this.modelName) {
        if (this.modelName == 'all') {
          this.modelName = 'all';
          var modelNN = ''
        } else {
          modelNN = this.modelName
        }
      } else {
        modelNN = this.modelName ? this.modelName : '';
      }
      if (this.trimName) {
        if (this.trimName == 'all') {
          this.trimName = 'all';
          var trimNNN = ''
        } else {
          trimNNN = this.trimName;
        }
      } else {
        trimNNN = this.trimName ? this.trimName : '';
      }

      if (this.provinceSelect) {
        if (this.provinceSelect == 'all') {
          this.provinceSelect = 'all';
          var provinceSSS = '';
        } else {
          provinceSSS = this.provinceSelect;
        }
      } else {
        provinceSSS = this.provinceSelect ? this.provinceSelect : '';
      }

      if (this.cityId) {
        if (this.cityId == 'all') {
          this.cityId = 'all';
          var cityNNN = ''
        } else {
          cityNNN = this.cityId;
        }
      } else {
        cityNNN = this.cityId ? this.cityId : '';
      }

      this.yearStartValue = this.homeMotorData.startingYear ? this.homeMotorData.startingYear : '';
      this.yearEndValue = this.homeMotorData.startingYear ? this.homeMotorData.startingYear : '';
      this.priceStartValue = this.homeMotorData.startingPrice ? this.homeMotorData.startingPrice : '';
      this.priceEndValue = this.homeMotorData.endingPrice ? this.homeMotorData.endingPrice : '';
      this.kiloMeterStartValue = this.homeMotorData.startingKilometer ? this.homeMotorData.startingKilometer : '';
      this.kiloMeterEndValue = this.homeMotorData.endingKilometer ? this.homeMotorData.endingKilometer : '';
      this.warrantyClickInfo = this.homeMotorData.warranty ? this.homeMotorData.warranty : '';
      this.specsInfoValue = this.homeMotorData.regionalSpecs ? this.homeMotorData.regionalSpecs : '';
      this.bodyTypeValue = this.homeMotorData.bodyType ? this.homeMotorData.bodyType : '';
      this.transMissionValue = this.homeMotorData.transmissionType ? this.homeMotorData.transmissionType : '';
      this.interiorColorValue = this.homeMotorData.interiorColor ? this.homeMotorData.interiorColor : '';
      this.exteriorValue = this.homeMotorData.exteriorColor ? this.homeMotorData.exteriorColor : '';
      this.clinderClickValue = this.homeMotorData.cylinders ? this.homeMotorData.cylinders : '';
      this.finalDriveValue = this.homeMotorData.finalDriveSystem ? this.homeMotorData.finalDriveSystem : '';
      this.wheelSelectValue = this.homeMotorData.wheels ? this.homeMotorData.wheels : '';
      this.engineSelectValue = this.homeMotorData.engineSize ? this.homeMotorData.engineSize : '';
      this.subCategId = this.homeMotorData.motorCategoryId ? this.homeMotorData.motorCategoryId : '';
      this.subsubCategId = this.homeMotorData.motorSubCategoryId ? this.homeMotorData.motorSubCategoryId : '';
      this.horsepowerSelectValue = this.homeMotorData.horsePower ? this.homeMotorData.horsePower : '';
      this.boatLgthSelectValue = this.homeMotorData.length ? this.homeMotorData.length : '';
      this.sortKey = this.homeMotorData.orderbyColumn ? this.homeMotorData.orderbyColumn : '';
      this.sortOrder = this.homeMotorData.orderbyValue ? this.homeMotorData.orderbyValue : '';
      this.page = this.homeMotorData.page ? this.homeMotorData.page : 1;
      this.tableSize = this.homeMotorData.limt ? this.homeMotorData.limit : 10;

      if (this.sortKey == '' && this.sortOrder == '') {
        this.sortedValue = 'Default'
      } else if (this.sortKey == 'id' && this.sortOrder == 'DESC') {
        this.sortedValue = 'NewestToOldest';
      } else if (this.sortKey == 'id' && this.sortOrder == 'ASC') {
        this.sortedValue = 'OldestToNewest';
      } else if (this.sortKey == 'price' && this.sortOrder == 'DESC') {
        this.sortedValue = 'PriceHighToLow';
      } else if (this.sortKey == 'price' && this.sortOrder == 'ASC') {
        this.sortedValue = 'PriceLowToHigh';
      } else if (this.sortKey == 'kilometer' && this.sortOrder == 'DESC') {
        this.sortedValue = 'kilometerHighToLow';
      } else if (this.sortKey == 'kilometer' && this.sortOrder == 'ASC') {
        this.sortedValue = 'kilometerLowToHigh';
      } else if (this.sortKey == 'year' && this.sortOrder == 'DESC') {
        this.sortedValue = 'yearHighToLow'
      } else if (this.sortKey == 'year' && this.sortOrder == 'ASC') {
        this.sortedValue = 'yearLowToHigh';
      }

      this.authService.getMotorFilter(this.mainCategId, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
        this.sortOrder, this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.placeMarkers();
          })
      this.clearFiltBtn = true;
    }

    this.warrantyInfo = [{ id: 1, value: 'Yes' }, { id: 0, value: 'No' }];
    this.specsInfo = [{ label: 'SaudiSpecs', value: 'Saudi Specs' }, { label: 'GCCSpecs', value: 'GCC Specs' },
    { label: 'AmericanSpecs', value: 'American Specs' }, { label: 'CanadianSpecs', value: 'Canadian Specs' },
    { label: 'EuropeanSpecs', value: 'European Specs' }, { label: 'JapaneseSpecs', value: 'Japanese Specs' },
    { label: 'Others', value: 'Others' }];
    this.bodyTypes = ['Sedan', 'SUV', 'Coupe', 'HardSoftTop', 'Convertible'];
    this.transmissionTypes = ['Automatic', 'Manual'];
    this.interiorColor = ['Beige', 'Black', 'Blue', 'Brown', 'Green', 'Grey', 'Orange', 'Red', 'Tan', 'White', 'Yellow', 'OtherColor'];
    this.exteriorColor = ['Black', 'Blue', 'Brown', 'Burgundy', 'Gold', 'Grey', 'Orange', 'Green', 'Purple', 'Red', 'Silver', 'Beige', 'White', 'Yellow', 'OtherColor'];
    this.cylinderArray = ['3', '4', '5', '6', '8', '10', '12'];
    this.finalDriveArray = [{ label: 'Belt', value: 'Belt' }, { label: 'Chain', value: 'Chain' },
    { label: 'Shaft', value: 'Shaft' }, { label: 'doesNotApply', value: 'Does not apply' }];
    this.wheelsArray = [{ label: '2', value: '2 Wheels' }, { label: '3', value: '3 Wheels' }, { label: '4', value: '4 Wheels' }]
    this.engineSizeArray = [{ label: 'LessThan250cc', value: 'Less than 250cc' }, { label: '250cc499cc', value: '250cc-499cc' }, { label: '500cc599cc', value: '500cc-599cc' },
    { label: '600cc749cc', value: '600cc-749cc' }, { label: '950cc999cv', value: '950cc-999cv' }, { label: '1000ccMore', value: '1000cc or more' },
    { label: 'doesNotApply', value: 'does not apply' }];
    this.horsePowerArray = [{ label: 'LessThan150HP', value: 'Less than 150 HP' }, { label: '150200HP', value: '150 - 200 HP' }, { label: '200300HP', value: '200 - 300 HP' },
    { label: '300400HP', value: '300 - 400 HP' }, { label: '400HP', value: '400+ HP' }, { label: 'Unknown', value: 'Unknown' }];

    this.boatLengthArray = [{ label: 'BrandNew', value: 'Brand New' }, { label: '0-1Month', value: '0-1 month' }, { label: '1-6Months', value: '1-6 months' },
    { label: '6-12Months', value: '6-12 months' }, { label: '1-2Years', value: '1-2 years' }, { label: '2-5Years', value: '2-5 years' }, { label: '5-10Years', value: '5-10 years' },
    { label: '10+Years', value: '10+ years' }];

    this.yearArray = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012',
      '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'];

    const rawPrice = [{ label: 'All', value: 'all' }, { label: `${riyalImg}0 -&nbsp;${riyalImg}25,000`, value: 1 },
    { label: `${riyalImg}25,001 -&nbsp;${riyalImg}50,000`, value: 2 }, { label: `${riyalImg}50,001 -&nbsp;${riyalImg}75,000`, value: 3 },
    { label: `${riyalImg}75,001 -&nbsp;${riyalImg}100,000`, value: 4 }, { label: `${riyalImg}100,001 -&nbsp;${riyalImg}125,000`, value: 5 },
    { label: `${riyalImg}125,001 -&nbsp;${riyalImg}150,000`, value: 6 }, { label: `${riyalImg}150,001 -&nbsp;${riyalImg}200,000`, value: 7 },
    { label: `${riyalImg}200,001 -&nbsp;${riyalImg}250,000`, value: 8 }, { label: `${riyalImg}250,001 -&nbsp;${riyalImg}300,000`, value: 9 },
    { label: `${riyalImg}300,001 -&nbsp;${riyalImg}400,000`, value: 10 }, { label: `${riyalImg}400,001 -&nbsp;${riyalImg}500,000`, value: 11 },
    { label: `${riyalImg}500,001 -&nbsp;${riyalImg}750,000`, value: 12 }, { label: `${riyalImg}750,001 -&nbsp;${riyalImg}2,000,000`, value: 13 }];

    this.priceRangeList = rawPrice.map(item => ({
      value: item.value,
      label: item.label.replace(/<[^>]*>?/gm, ''), // plain label for collapsed view
      htmlLabel: this.sanitizer.bypassSecurityTrustHtml(item.label) // for dropdown list
    }));

    this.kiloRangeList = [{ label: 'All', value: 'all' },
    { label: '0 - 25,000 km', value: 1 }, { label: '25,001 - 50,000 km', value: 2 },
    { label: '50,001 - 75,000 km', value: 3 }, { label: '75,001 - 100,000 km', value: 4 },
    { label: '100,001 - 125,000 km', value: 5 }, { label: '125,001 - 150,000 km', value: 6 },
    { label: '150,001 - 200,000 km', value: 7 }, { label: '200,001 - 250,000 km', value: 8 },
    { label: '250,001 - 300,000 km', value: 9 }, { label: '300,001 - 400,000 km', value: 10 },
    { label: '400,001 - 500,000 km', value: 11 }];

    this.sortArray = ['Default', 'NewestToOldest', 'OldestToNewest', 'PriceHighToLow', 'PriceLowToHigh', 'kilometerHighToLow', 'kilometerLowToHigh', 'yearHighToLow', 'yearLowToHigh'];

    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.params = params['category'];
    });
    // get motor Ceategory list
    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.params == element.id) {
            this.cateeName = element.name;
          }
        });
      })
    // get Makes list based on category
    if (this.params == 1) {
      this.authService.getCarMakes("CAR").subscribe(
        (res: any) => {
          this.makesCarList = res.data.sort((a, b) => a.name.localeCompare(b.name));;
          this.selectedMakes = this.makesCarList;
        })
    } else if (this.params == 2) {
      this.authService.getCarMakes("BIKE").subscribe(
        (res: any) => {
          this.makesCarList = res.data.sort((a, b) => a.name.localeCompare(b.name));;
          this.selectedMakes = this.makesCarList;
        })
    }
    if (this.params == 2 || this.params == 3 || this.params == 4) {
      this.authService.getMotorSubCateg(this.params).subscribe(
        (res: any) => {
          this.subCategArray = res.data.sort((a, b) => a.motorCategoriesName.localeCompare(b.motorCategoriesName));
          this.selecteMotorCateg = this.subCategArray;
        })
    }
    if (!this.homeMotorData) {
      // get Posts based on category only
      this.authService.getCategoryMotorPosts(this.params, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.placeMarkers();
        })
    }
    // get All Provinces
    this.authService.getProvince().subscribe(
      (res: any) => {
        this.provinceList = res.data.sort((a, b) => a.name.localeCompare(b.name));
        this.selectedProvince = this.provinceList;
      })
  }

  ngAfterViewInit(): void {
    if (this.sessionHistory?.scrollPosition !== undefined) {
      this.onStableSub = this.ngZone.onStable.subscribe(() => {
        // console.log("Restoring scroll to", this.sessionHistory.scrollPosition);
        window.scrollTo({
          top: this.sessionHistory.scrollPosition || 0,
          behavior: 'auto'
        });
      });
    } else {
      this.onStableSub = this.ngZone.onStable.subscribe(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      });
    }
  }

  scrollSetFunction() {
    this.onStableSub?.unsubscribe(); // cleanup previous if any
    this.onStableSub = this.ngZone.onStable.subscribe(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      this.onStableSub?.unsubscribe();
    });
  }

  onTableDataChange(event: any) {
    this.scrollSetFunction();
    this.page = event;
    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';

    const object = {
      mainMotorCategoryId: this.params ? this.params : '',
      make: this.makeName ? this.makeName : '',
      model: this.modelName ? this.modelName : '',
      trim: this.trimName ? this.trimName : '',
      provinceId: this.provinceSelect ? this.provinceSelect : '',
      cityId: this.cityId ? this.cityId : '',
      startingPrice: this.priceStartValue ? this.priceStartValue : '',
      endingPrice: this.priceEndValue ? this.priceEndValue : '',
      startingYear: this.yearStartValue ? this.yearStartValue : '',
      endingYear: this.yearEndValue ? this.yearEndValue : '',
      startingKilometer: this.kiloMeterStartValue ? this.kiloMeterStartValue : '',
      endingKilometer: this.kiloMeterEndValue ? this.kiloMeterEndValue : '',
      warranty: this.warrantyClickInfo ? this.warrantyClickInfo : '',
      regionalSpecs: this.specsInfoValue ? this.specsInfoValue : '',
      bodyType: this.bodyTypeValue ? this.bodyTypeValue : '',
      transmissionType: this.transMissionValue ? this.transMissionValue : '',
      interiorColor: this.interiorColorValue ? this.interiorColorValue : '',
      exteriorColor: this.exteriorValue ? this.exteriorValue : '',
      cylinders: this.clinderClickValue ? this.clinderClickValue : '',
      finalDriveSystem: this.finalDriveValue ? this.finalDriveValue : '',
      wheels: this.wheelSelectValue ? this.wheelSelectValue : '',
      engineSize: this.engineSelectValue ? this.engineSelectValue : '',
      motorCategoryId: this.subCategId ? this.subCategId : '',
      motorSubCategoryId: this.subsubCategId ? this.subsubCategId : '',
      horsePower: this.horsepowerSelectValue ? this.horsepowerSelectValue : '',
      length: this.boatLgthSelectValue ? this.boatLgthSelectValue : '',
      orderbyColumn: this.sortKey ? this.sortKey : '',
      orderbyValue: this.sortOrder ? this.sortOrder : '',
      page: event,
      limit: this.tableSize
    }
    this.authService.getMotorFilter(object.mainMotorCategoryId, object.make, object.model, object.trim,
      object.provinceId, object.cityId, object.startingPrice, object.endingPrice, object.startingYear,
      object.endingYear, object.startingKilometer, object.endingKilometer, object.warranty, object.regionalSpecs,
      object.bodyType, object.transmissionType, object.interiorColor, object.exteriorColor,
      object.cylinders, object.finalDriveSystem, object.wheels, object.engineSize,
      object.motorCategoryId, object.motorSubCategoryId, object.horsePower, object.length, object.orderbyColumn,
      object.orderbyValue, object.page, object.limit).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.placeMarkers();
        })
  }


  onMotorKey(event) {
    this.selecteMotorCateg = this.categSearch(event.target.value);
  }

  categSearch(value: string) {
    let filter = value.toLowerCase();
    return this.subCategArray.filter(option =>
      option.motorCategoriesName.toLowerCase().startsWith(filter)
    );
  }

  onMotorCategChange(value) {
    if (value == 'all') {
      this.subCategId = 'all';
      var subCAT = ''
      this.subSubCategDropOpen = false;
      this.authService.getMotorSubSubCateg(0).subscribe(
        (res: any) => {
          this.subSubCategList = res.data.sort((a, b) => a.motorSubCategoriesName.localeCompare(b.motorSubCategoriesName));
          this.selectedSubCateg = this.subSubCategList;
        })
    } else {
      this.subCategId = value;
      subCAT = this.subCategId;
      this.authService.getMotorSubSubCateg(this.subCategId).subscribe(
        (res: any) => {
          this.subSubCategList = res.data.sort((a, b) => a.motorSubCategoriesName.localeCompare(b.motorSubCategoriesName));
          this.selectedSubCateg = this.subSubCategList;
        })
      this.subSubCategDropOpen = true;
    }
    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all'
        var cityNN = '';
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.subsubCategId = '';
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      cityNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCAT, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  onSubCategKey(event) {
    this.selectedSubCateg = this.subCategSearch(event.target.value);
  }

  subCategSearch(value: string) {
    let filter = value.toLowerCase();
    return this.subSubCategList.filter(option =>
      option.motorSubCategoriesName.toLowerCase().startsWith(filter)
    );
  }

  onSubCategChange(id) {
    if (id == 'all') {
      this.subsubCategId = 'all';
      var subSuBB = '';
    } else {
      this.subsubCategId = id;
      subSuBB = this.subsubCategId;
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all'
        var cityNN = '';
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      cityNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, subSuBB, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }


  subSubCateg(id) {
    if (this.subsubCategId) {
      if (this.subsubCategId == 'all') {
        this.subsubCategId = 'all';
        var subSubCateNN = ''
      } else {
        subSubCateNN = id;
      }
    } else {
      subSubCateNN = id ? id : '';
    }

    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCategNNN = '';
      } else {
        subCategNNN = this.subCategId;
      }
    } else {
      subCategNNN = this.subCategId ? this.subCategId : '';
    }

    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCategNNN, subSubCateNN, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  onKey(event) {
    this.selectedMakes = this.search(event.target.value);
  }

  onAllClick() {
    this.scrollSetFunction();
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.makesCarList.filter(option =>
      option.name.toLowerCase().startsWith(filter)
    );
  }

  onMakeChange(data) {
    if (data == 'all') {
      this.makeName = 'all';
      var makeNN = ''
      this.modelOpen = false;
      this.trimOpen = false;
    } else {
      this.makeName = data;
      makeNN = data;
      this.modelOpen = true;
    }
    this.modelName = '';
    this.trimName = '';
    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinSS = '';
      } else {
        provinSS = this.provinceSelect;
      }
    } else {
      provinSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all'
        var cityNN = '';
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateNN = ''
      } else {
        subCateNN = this.subCategId;
      }
    } else {
      subCateNN = this.subCategId ? this.subCategId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';

    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, makeNN, this.modelName, this.trimName, provinSS,
      cityNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    // sessionStorage.setItem("filterHistory",)

    if (this.params == 1) {
      this.authService.getCarMakes("CAR").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (data == element.name) {
              this.makeId = element.id;
              this.authService.getCarModel(this.makeId, "CAR").subscribe(
                (res: any) => {
                  this.modelCarList = res.data.sort((a, b) => a.modelName.localeCompare(b.modelName));
                  this.selectedModel = this.modelCarList;
                }
              );
            }
          });
        })
    } else if (this.params == 2) {
      this.authService.getCarMakes("BIKE").subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            if (data == element.name) {
              this.makeId = element.id;
              this.authService.getCarModel(this.makeId, "BIKE").subscribe(
                (res: any) => {
                  this.modelCarList = res.data.sort((a, b) => a.modelName.localeCompare(b.modelName));
                  this.selectedModel = this.modelCarList;
                }
              );
            }
          });
        })
    }
    this.clearFiltBtn = true;
  }

  onModelKey(event) {
    this.selectedModel = this.modelSearch(event.target.value);
  }

  modelSearch(value: string) {
    let filter = value.toLowerCase();
    return this.modelCarList.filter(option =>
      option.modelName.toLowerCase().startsWith(filter)
    );
  }

  onModelChange(data) {
    if (data == 'all') {
      this.modelName = 'all';
      var modelNN = ''
      this.trimOpen = false;
    } else {
      if (this.params == 1) {
        this.trimOpen = true;
      }
      this.modelName = data;
      modelNN = data;
    }
    this.makeName = this.makeName ? this.makeName : '';
    this.trimName = '';
    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinSS = '';
      } else {
        provinSS = this.provinceSelect;
      }
    } else {
      provinSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all'
        var cityNN = '';
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateNN = ''
      } else {
        subCateNN = this.subCategId;
      }
    } else {
      subCateNN = this.subCategId ? this.subCategId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, modelNN, this.trimName, provinSS,
      cityNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })

    this.authService.getCarModel(this.makeId, "CAR").subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (data == element.modelName) {
            this.modelId = element.id;
            this.authService.getTrim(this.makeId, element.id).subscribe(
              (res: any) => {
                this.trimList = res.data;
                this.selectedTrim = this.trimList;
              })
          }
        });
      })
    this.clearFiltBtn = true;
  }

  onTrimFilter(value) {
    if (value == 'all') {
      this.trimName = 'all';
      var trimNN = '';
    } else {
      this.trimName = value;
      trimNN = value;
    }
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinSS = '';
      } else {
        provinSS = this.provinceSelect;
      }
    } else {
      provinSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateNN = ''
      } else {
        subCateNN = this.subCategId;
      }
    } else {
      subCateNN = this.subCategId ? this.subCategId : '';
    }
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, trimNN, provinSS,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  onTrimKey(event) {
    this.selectedTrim = this.trimSearch(event.target.value);
  }
  trimSearch(value: string) {
    let filter = value.toLowerCase();
    return this.trimList.filter(option =>
      option.enName.toLowerCase().startsWith(filter)
    );
  }

  onProvinceKey(event) {
    this.selectedProvince = this.provinceSearch(event.target.value);
  }

  provinceSearch(value: string) {
    let filter = value.toLowerCase();
    return this.provinceList.filter(option =>
      option.name.toLowerCase().startsWith(filter)
    );
  }

  onProvinceChange(value) {
    if (value == 'all') {
      this.provinceSelect = 'all';
      var provinceNN = '';
      this.cityOpen = false;
    } else {
      this.provinceSelect = value;
      provinceNN = value;
      this.cityOpen = true;
    }
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    if (this.makeName) {
      if (this.makeName == 'all') {
        this.makeName = 'all';
        var makeNN = ''
      } else {
        makeNN = this.makeName
      }
    } else {
      makeNN = this.makeName ? this.makeName : '';
    }

    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }
    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }

    this.cityId = '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceNN, this.cityId,
      this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })

    this.authService.getCity(value).subscribe(
      (res: any) => {
        this.cityList = res.data.sort((a, b) => a.city.localeCompare(b.city));
        this.selectedCity = this.cityList;
      });
    this.clearFiltBtn = true;
  }

  onCityKey(event) {
    this.selectedCity = this.citySearch(event.target.value);
  }

  citySearch(value: string) {
    let filter = value.toLowerCase();
    return this.cityList.filter(option =>
      option.city.toLowerCase().startsWith(filter)
    );
  }

  onCityChange(value) {
    if (value == 'all') {
      this.cityId = 'all';
      var cityNN = '';
    } else {
      this.cityId = value;
      cityNN = value;
    }
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    this.makeName = this.makeName ? this.makeName : '';
    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }

    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }

    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, modelNN, trimNNN, this.provinceSelect,
      cityNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    this.filterSecShow = false;
    this.showDropdown = false;
    this.yearShowDropDown = false;
    this.kiloDropDown = false;
    this.sortShow = false;
  }

  dropShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.filterSecShow = false;
    this.yearShowDropDown = false;
    this.kiloDropDown = false;
    this.sortShow = false;
  }

  onPriceChange(value) {
    this.scrollSetFunction();
    this.priceSelect = value;
    if (this.priceSelect == 'all') {
      this.priceStartValue = '';
      this.priceEndValue = '';
    } else if (this.priceSelect == 1) {
      this.priceStartValue = 0;
      this.priceEndValue = 25000;
    } else if (this.priceSelect == 2) {
      this.priceStartValue = 25001;
      this.priceEndValue = 50000;
    } else if (this.priceSelect == 3) {
      this.priceStartValue = 50001;
      this.priceEndValue = 75000;
    } else if (this.priceSelect == 4) {
      this.priceStartValue = 75001;
      this.priceEndValue = 100000;
    } else if (this.priceSelect == 5) {
      this.priceStartValue = 100001;
      this.priceEndValue = 125000;
    } else if (this.priceSelect == 6) {
      this.priceStartValue = 125001;
      this.priceEndValue = 150000;
    } else if (this.priceSelect == 7) {
      this.priceStartValue = 150001;
      this.priceEndValue = 200000;
    } else if (this.priceSelect == 8) {
      this.priceStartValue = 200001;
      this.priceEndValue = 250000;
    } else if (this.priceSelect == 9) {
      this.priceStartValue = 250001;
      this.priceEndValue = 300000;
    } else if (this.priceSelect == 10) {
      this.priceStartValue = 300001;
      this.priceEndValue = 400000;
    } else if (this.priceSelect == 11) {
      this.priceStartValue = 400001;
      this.priceEndValue = 500000;
    } else if (this.priceSelect == 12) {
      this.priceStartValue = 500001;
      this.priceEndValue = 750000;
    } else if (this.priceSelect == 13) {
      this.priceStartValue = 750001;
      this.priceEndValue = 2000000;
    }
    this.priceFilter();
    // console.log("fe", this.priceSelect)
  }

  priceStart(event) {
    this.priceStartValue = event.target.value;
  }
  priceEnd(event) {
    this.priceEndValue = event.target.value;
  }

  priceFilter() {
    this.scrollSetFunction();
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    if (this.makeName) {
      if (this.makeName == 'all') {
        this.makeName = 'all';
        var makeNN = ''
      } else {
        makeNN = this.makeName
      }
    } else {
      makeNN = this.makeName ? this.makeName : '';
    }

    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }
    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSSS = '';
      } else {
        provinceSSS = this.provinceSelect;
      }
    } else {
      provinceSSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNNN = ''
      } else {
        cityNNN = this.cityId;
      }
    } else {
      cityNNN = this.cityId ? this.cityId : '';
    }

    this.showDropdown = false;
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
      cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  clearPriceFilter() {
    this.scrollSetFunction();
    this.showDropdown = false;
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subCategId = this.subCategId ? this.subCategId : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.priceStartValue = '';
    this.priceEndValue = '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  yearShow($event) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.yearShowDropDown = !this.yearShowDropDown;
    this.showDropdown = false;
    this.filterSecShow = false;
    this.kiloDropDown = false;
    this.sortShow = false;
  }

  yearStart(event) {
    this.yearStartValue = event.target.value;
  }
  yearEnd(event) {
    this.yearEndValue = event.target.value;
  }

  onYearChange(value) {
    this.scrollSetFunction();
    this.yearSelect = value;
    this.yearStartValue = this.yearSelect;
    this.yearEndValue = this.yearSelect;
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    if (this.makeName) {
      if (this.makeName == 'all') {
        this.makeName = 'all';
        var makeNN = ''
      } else {
        makeNN = this.makeName;
      }
    } else {
      makeNN = this.makeName ? this.makeName : '';
    }

    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName;
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }
    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSSS = '';
      } else {
        provinceSSS = this.provinceSelect;
      }
    } else {
      provinceSSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNNN = ''
      } else {
        cityNNN = this.cityId;
      }
    } else {
      cityNNN = this.cityId ? this.cityId : '';
    }

    this.yearShowDropDown = false;
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subCategId = this.subCategId ? this.subCategId : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
      cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  clearYearFilter() {
    this.scrollSetFunction();
    this.yearShowDropDown = false;
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.yearStartValue = '';
    this.yearEndValue = '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  kilometerShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.kiloDropDown = !this.kiloDropDown;
    this.showDropdown = false;
    this.filterSecShow = false;
    this.yearShowDropDown = false;
    this.sortShow = false;
  }

  onKiloRangeChange(value) {
    this.scrollSetFunction();
    this.kiloRangevalue = value;
    if (this.kiloRangevalue == 'all') {
      this.kiloMeterStartValue = '';
      this.kiloMeterEndValue = '';
    } else if (this.kiloRangevalue == 1) {
      this.kiloMeterStartValue = 0;
      this.kiloMeterEndValue = 25000;
    } else if (this.kiloRangevalue == 2) {
      this.kiloMeterStartValue = 25001;
      this.kiloMeterEndValue = 50000;
    } else if (this.kiloRangevalue == 3) {
      this.kiloMeterStartValue = 50001;
      this.kiloMeterEndValue = 75000;
    } else if (this.kiloRangevalue == 4) {
      this.kiloMeterStartValue = 75001;
      this.kiloMeterEndValue = 100000;
    } else if (this.kiloRangevalue == 5) {
      this.kiloMeterStartValue = 100001;
      this.kiloMeterEndValue = 125000;
    } else if (this.kiloRangevalue == 6) {
      this.kiloMeterStartValue = 125001;
      this.kiloMeterEndValue = 150000;
    } else if (this.kiloRangevalue == 7) {
      this.kiloMeterStartValue = 150001;
      this.kiloMeterEndValue = 200000;
    } else if (this.kiloRangevalue == 8) {
      this.kiloMeterStartValue = 200001;
      this.kiloMeterEndValue = 250000;
    } else if (this.kiloRangevalue == 9) {
      this.kiloMeterStartValue = 250001;
      this.kiloMeterEndValue = 300000;
    } else if (this.kiloRangevalue == 10) {
      this.kiloMeterStartValue = 300001;
      this.kiloMeterEndValue = 400000;
    } else if (this.kiloRangevalue == 11) {
      this.kiloMeterStartValue = 400001;
      this.kiloMeterEndValue = 500000;
    }
    this.kiloMeterFilter();
    // console.log("fe", this.priceSelect)
  }

  kiloMeterStart(event) {
    this.kiloMeterStartValue = event.target.value;
  }
  kiloMeterEnd(event) {
    this.kiloMeterEndValue = event.target.value;
  }

  kiloMeterFilter() {
    this.scrollSetFunction();
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    if (this.makeName) {
      if (this.makeName == 'all') {
        this.makeName = 'all';
        var makeNN = ''
      } else {
        makeNN = this.makeName;
      }
    } else {
      makeNN = this.makeName ? this.makeName : '';
    }

    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName;
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }
    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSSS = '';
      } else {
        provinceSSS = this.provinceSelect;
      }
    } else {
      provinceSSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNNN = ''
      } else {
        cityNNN = this.cityId;
      }
    } else {
      cityNNN = this.cityId ? this.cityId : '';
    }

    this.kiloDropDown = false;
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
      cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }
  clearKiloMeterFilter() {
    this.scrollSetFunction();
    this.kiloDropDown = false;
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subCategId = this.subCategId ? this.subCategId : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.kiloMeterStartValue = '';
    this.kiloMeterEndValue = '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }
  filterShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.filterSecShow = !this.filterSecShow;
    this.showDropdown = false;
    this.yearShowDropDown = false;
    this.kiloDropDown = false;
    this.sortShow = false;
  }

  yearDropdownClick(value) {
    this.yearDropDownval = value;
    this.yearStartValue = this.yearDropDownval;
    this.yearEndValue = this.yearDropDownval;
  }

  warrantyClick(value) {
    this.warrantyClickInfo = value;
  }

  specsInfoclick(value) {
    this.specsInfoValue = value;
  }

  bodyTypeClick(value) {
    this.bodyTypeValue = value;
  }

  transmissionClick(value) {
    this.transMissionValue = value;
  }

  interiorClick(value) {
    this.interiorColorValue = value;
  }

  exteriorClick(value) {
    this.exteriorValue = value;
  }

  cliynderClick(value) {
    this.clinderClickValue = value;
  }

  finalDriveClick(value) {
    this.finalDriveValue = value;
  }

  wheelClick(value) {
    this.wheelSelectValue = value;
  }

  engineSizeClick(value) {
    this.engineSelectValue = value;
  }

  horsePowerclick(value) {
    this.horsepowerSelectValue = value
  }

  boatLengthClick(value) {
    this.boatLgthSelectValue = value;
  }

  allFilter() {
    this.scrollSetFunction();
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subCategId = this.subCategId ? this.subCategId : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.filterSecShow = false;
    this.clearFiltBtn = true;
  }

  clearAllFilter() {
    this.scrollSetFunction();
    this.filterSecShow = false;
    this.makeName = this.makeName ? this.makeName : '';
    this.modelName = this.modelName ? this.modelName : '';
    this.trimName = this.trimName ? this.trimName : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.subCategId = this.subCategId ? this.subCategId : '';
    this.priceStartValue = '';
    this.priceEndValue = '';
    this.yearStartValue = '';
    this.yearEndValue = '';
    this.kiloMeterStartValue = '';
    this.kiloMeterEndValue = '';
    this.warrantyClickInfo = '';
    this.specsInfoValue = '';
    this.bodyTypeValue = '';
    this.transMissionValue = '';
    this.interiorColorValue = '';
    this.exteriorValue = '';
    this.clinderClickValue = '';
    this.finalDriveValue = '';
    this.wheelSelectValue = '';
    this.engineSelectValue = '';
    this.subsubCategId = '';
    this.horsepowerSelectValue = '';
    this.boatLgthSelectValue = '';

    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.page ? this.page : 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    this.authService.getMotorFilter(this.params, this.makeName, this.modelName, this.trimName, this.provinceSelect,
      this.cityId, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
      this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
      this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
      this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
      this.subCategId, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.motorPostCount) {
            this.totalPostCount = res.motorPostCount;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  clearFiltersAll() {
    this.scrollSetFunction();
    location.reload();
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("filterHistory");
  }

  sortFunc($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.sortShow = !this.sortShow;
    this.filterSecShow = false;
    this.showDropdown = false;
    this.yearShowDropDown = false;
    this.kiloDropDown = false;
  }

  sortFilter(value) {
    if (this.subCategId) {
      if (this.subCategId == 'all') {
        this.subCategId = 'all';
        var subCateGNNNN = '';
      } else {
        subCateGNNNN = this.subCategId;
      }
    } else {
      subCateGNNNN = this.subCategId ? this.subCategId : '';
    }
    if (this.makeName) {
      if (this.makeName == 'all') {
        this.makeName = 'all';
        var makeNN = ''
      } else {
        makeNN = this.makeName
      }
    } else {
      makeNN = this.makeName ? this.makeName : '';
    }

    if (this.modelName) {
      if (this.modelName == 'all') {
        this.modelName = 'all';
        var modelNN = ''
      } else {
        modelNN = this.modelName
      }
    } else {
      modelNN = this.modelName ? this.modelName : '';
    }
    if (this.trimName) {
      if (this.trimName == 'all') {
        this.trimName = 'all';
        var trimNNN = ''
      } else {
        trimNNN = this.trimName;
      }
    } else {
      trimNNN = this.trimName ? this.trimName : '';
    }
    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSSS = '';
      } else {
        provinceSSS = this.provinceSelect;
      }
    } else {
      provinceSSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNNN = ''
      } else {
        cityNNN = this.cityId;
      }
    } else {
      cityNNN = this.cityId ? this.cityId : '';
    }
    this.sortedValue = value;
    this.sortShow = false;
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.yearStartValue = this.yearStartValue ? this.yearStartValue : '';
    this.yearEndValue = this.yearEndValue ? this.yearEndValue : '';
    this.kiloMeterStartValue = this.kiloMeterStartValue ? this.kiloMeterStartValue : '';
    this.kiloMeterEndValue = this.kiloMeterEndValue ? this.kiloMeterEndValue : '';
    this.warrantyClickInfo = this.warrantyClickInfo ? this.warrantyClickInfo : '';
    this.specsInfoValue = this.specsInfoValue ? this.specsInfoValue : '';
    this.bodyTypeValue = this.bodyTypeValue ? this.bodyTypeValue : '';
    this.transMissionValue = this.transMissionValue ? this.transMissionValue : '';
    this.interiorColorValue = this.interiorColorValue ? this.interiorColorValue : '';
    this.exteriorValue = this.exteriorValue ? this.exteriorValue : '';
    this.clinderClickValue = this.clinderClickValue ? this.clinderClickValue : '';
    this.finalDriveValue = this.finalDriveValue ? this.finalDriveValue : '';
    this.wheelSelectValue = this.wheelSelectValue ? this.wheelSelectValue : '';
    this.engineSelectValue = this.engineSelectValue ? this.engineSelectValue : '';
    this.subsubCategId = this.subsubCategId ? this.subsubCategId : '';
    this.horsepowerSelectValue = this.horsepowerSelectValue ? this.horsepowerSelectValue : '';
    this.boatLgthSelectValue = this.boatLgthSelectValue ? this.boatLgthSelectValue : '';
    this.page = 1;
    this.tableSize = this.tableSize ? this.tableSize : 10;

    if (this.sortedValue == 'Default') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, '',
        '', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'NewestToOldest') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'id',
        'DESC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'OldestToNewest') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'id',
        'ASC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'price',
        'DESC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'price',
        'ASC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'kilometer',
        'DESC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'kilometer',
        'ASC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'yearHighToLow') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'year',
        'DESC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.authService.getMotorFilter(this.params, makeNN, modelNN, trimNNN, provinceSSS,
        cityNNN, this.priceStartValue, this.priceEndValue, this.yearStartValue, this.yearEndValue,
        this.kiloMeterStartValue, this.kiloMeterEndValue, this.warrantyClickInfo, this.specsInfoValue,
        this.bodyTypeValue, this.transMissionValue, this.interiorColorValue, this.exteriorValue,
        this.clinderClickValue, this.finalDriveValue, this.wheelSelectValue, this.engineSelectValue,
        subCateGNNNN, this.subsubCategId, this.horsepowerSelectValue, this.boatLgthSelectValue, 'year',
        'ASC', this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            if (res.motorPostCount) {
              this.totalPostCount = res.motorPostCount;
            } else {
              this.totalPostCount = 0;
            }
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    }
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }

  mapShow() {
    this.scrollSetFunction();
    this.mapFilterShow = true;
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      // console.error('Map element not found');
      return;
    }
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 23.8859, lng: 45.0792 },
      zoom: 6,
      gestureHandling: 'greedy', // Enable gesture handling
    });
    this.placeMarkers();
  }

  placeMarkers(): void {
    function encodeSVG(rawSvgString: string): string {
      const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;
      rawSvgString = rawSvgString.replace(/'/g, '"').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ');

      return ('data:image/svg+xml;utf-8,' + rawSvgString.replace(symbols, encodeURIComponent));
    }
    // console.log("list",this.postList)

    this.postList.forEach(marker => {
      const tagSvgRaw = (price: string) => `
      <svg xmlns="http://www.w3.org/2000/svg" width="${newWidth}" height="45" viewBox="0 0 ${newWidth} 45" fill="none">
        <rect width="${newWidth}" height="37" rx="10" fill="#316C3B"/>
        <path d="M35 45L27 37H43L35 45Z" fill="#316C3B"/>
        <text x="50%" y="24"
              text-anchor="middle" fill="#FFF"
              font-size="18px" font-family="sans-serif" font-weight="bold">
              ${price}
        </text>
      </svg>`;
      const priceAsCurrency = this.currencyPipe.transform(marker.price, '', '', '3.0');
      const riyalImg = '<img src="assets/images/saudi_riyal_logo.svg" style="width:13px;">&nbsp;';
      const price = `${priceAsCurrency}`;
      const textLength = this.getTextLength(price.toString());
      const newWidth = textLength + 20; // Adjust width based on text length plus some padding
      const priceTagSvg = tagSvgRaw(price);
      if (marker.latitude && marker.longitude !== '0') {
        var latValue = Number(marker.latitude)
        var lngValue = Number(marker.longitude)
        const newMarker = new google.maps.Marker({
          map: this.map,
          position: { lat: latValue, lng: lngValue },
          icon: {
            url: encodeSVG(priceTagSvg),
            scaledSize: new google.maps.Size(80, 56),
          }
        });

        let condition = '';
        if (marker.mainMotorCategoryId == 1 || marker.mainMotorCategoryId == 2) {
          condition += `${marker.make} • ${marker.model}`;
        } else if (marker.mainMotorCategoryId == 3 || marker.mainMotorCategoryId == 4) {
          condition += `${marker.motorCategoryName} • ${marker.motorSubCategoryName}`;
        }

        let kiloCondition = '';
        if (marker.mainMotorCategoryId == 1 || marker.mainMotorCategoryId == 2 || marker.mainMotorCategoryId == 3) {
          kiloCondition += `${marker.year} • ${marker.kilometer} ${this.translate.instant("km")}`;
        } else if (marker.mainMotorCategoryId == 4) {
          kiloCondition += `${marker.age} • ${marker.length}`;
        }
        const dynamicUrl = `/ad-details/motors/${marker.id}`;

        const contentString = `
      <a href="${dynamicUrl}" (click)="navigateToRoute(${marker.id})">
        <div class="prod_box">
        <p class="text-center mb-0"><img src="${this.sortImageArray(marker.image)?.[0]?.url || ''}" 
        style="border-radius: 10px;" width="100" height="100"></p>
        <div class="price_det">
        <h6 class="price_tag"> ${riyalImg} ${priceAsCurrency}</h6>
        <p class="features">${condition}</p>
        <p class="locat">${kiloCondition}</p>
        </div>
      </div></a>`;

        const infoWindow = new google.maps.InfoWindow({
          content: contentString, maxWidth: 600
        });

        newMarker.addListener('click', () => {
          infoWindow.open(this.map, newMarker);
        });
      }
    });
  }
  navigateToRoute(id) {
    this.router.navigateByUrl(`/ad-details/motors/${id}'`);
  }

  getTextLength(text: string): number {
    // Approximate text length calculation based on font size and characters
    const fontSize = 18; // Replace with your font size in pixels
    return text.length * (fontSize * 0.6); // Adjust multiplier based on font and characters used
  }

  removeMapShow() {
    this.mapFilterShow = false;
  }

  adDetailsPage(postid) {
    this.sortedValue = this.sortedValue ? this.sortedValue : 'Default';
    if (this.sortedValue == 'Default') {
      this.sortKey = '';
      this.sortOrder = '';
    } else if (this.sortedValue == 'NewestToOldest') {
      this.sortKey = 'id';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'OldestToNewest') {
      this.sortKey = 'id';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.sortKey = 'price';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.sortKey = 'price';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'kilometerHighToLow') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'kilometerLowToHigh') {
      this.sortKey = 'kilometer';
      this.sortOrder = 'ASC';
    } else if (this.sortedValue == 'yearHighToLow') {
      this.sortKey = 'year';
      this.sortOrder = 'DESC';
    } else if (this.sortedValue == 'yearLowToHigh') {
      this.sortKey = 'year';
      this.sortOrder = 'ASC';
    }
    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';

    const object = {
      mainMotorCategoryId: this.params ? this.params : '',
      make: this.makeName ? this.makeName : '',
      model: this.modelName ? this.modelName : '',
      trim: this.trimName ? this.trimName : '',
      provinceId: this.provinceSelect ? this.provinceSelect : '',
      cityId: this.cityId ? this.cityId : '',
      startingPrice: this.priceStartValue ? this.priceStartValue : '',
      endingPrice: this.priceEndValue ? this.priceEndValue : '',
      startingYear: this.yearStartValue ? this.yearStartValue : '',
      endingYear: this.yearEndValue ? this.yearEndValue : '',
      startingKilometer: this.kiloMeterStartValue ? this.kiloMeterStartValue : '',
      endingKilometer: this.kiloMeterEndValue ? this.kiloMeterEndValue : '',
      warranty: this.warrantyClickInfo ? this.warrantyClickInfo : '',
      regionalSpecs: this.specsInfoValue ? this.specsInfoValue : '',
      bodyType: this.bodyTypeValue ? this.bodyTypeValue : '',
      transmissionType: this.transMissionValue ? this.transMissionValue : '',
      interiorColor: this.interiorColorValue ? this.interiorColorValue : '',
      exteriorColor: this.exteriorValue ? this.exteriorValue : '',
      cylinders: this.clinderClickValue ? this.clinderClickValue : '',
      finalDriveSystem: this.finalDriveValue ? this.finalDriveValue : '',
      wheels: this.wheelSelectValue ? this.wheelSelectValue : '',
      engineSize: this.engineSelectValue ? this.engineSelectValue : '',
      motorCategoryId: this.subCategId ? this.subCategId : '',
      motorSubCategoryId: this.subsubCategId ? this.subsubCategId : '',
      horsePower: this.horsepowerSelectValue ? this.horsepowerSelectValue : '',
      length: this.boatLgthSelectValue ? this.boatLgthSelectValue : '',
      orderbyColumn: this.sortKey ? this.sortKey : '',
      orderbyValue: this.sortOrder ? this.sortOrder : '',
      page: this.page ? this.page : 1,
      limit: this.tableSize,
      scrollPosition: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }
    // console.log("histr",object)
    sessionStorage.setItem('filterHistory', JSON.stringify(object));
    sessionStorage.removeItem("homeFilter");
    this.router.navigate([`/ad-details/motors/${postid}`]);
  }

  ngOnDestroy(): void {
    this.onStableSub?.unsubscribe();
  }
}
