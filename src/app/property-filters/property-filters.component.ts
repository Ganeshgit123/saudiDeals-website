import { Component, HostListener, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
declare const google: any;
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-property-filters',
  templateUrl: './property-filters.component.html',
  styleUrls: ['./property-filters.component.css'],
  standalone: false
})
export class PropertyFiltersComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  private onStableSub?: Subscription;
  type: any;
  dir: any;
  params: any;
  categId: any;
  postList = [];
  postListCount: any;
  categArray = [];
  selectedCategory = [];
  provinceList = [];
  selectedProvince = [];
  provinceSelect: any;
  cityOpen = false;
  cityList = [];
  selectedCity = [];
  cityId: any;
  showDropdown = false;
  priceStartValue: any;
  priceEndValue: any;
  showBedDropdown = false;
  bedNumber = [];
  bedsValue: any = 0;
  bathShowDropdown = false;
  propAgeArray = [];
  propAgeValue: any = 0;
  propAgeDropdown = false;
  termsValue: any = 0;
  filterSecShow = false;
  areaStartValue: any;
  areaEndValue: any;
  bathArray = [];
  bathTotValue: any = 0;
  clearFiltBtn = false;
  sortShow = false;
  sortArray = [];
  sortedValue: any;
  homePropertyData: any;
  propRentalTermValue: any;
  rentalTermArray = [];
  sortKey: any;
  sortOrder: any;
  mapFilterShow = false;
  map: any;
  markers: any[] = [];
  page: number = 1;
  tableSize: number = 10;
  totalPostCount: any;
  sessionHistory: any;

  constructor(public authService: ApiCallService,
    private translate: TranslateService, private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    const sessionHome = JSON.parse(sessionStorage.getItem('homeFilter'));
    this.sessionHistory = JSON.parse(sessionStorage.getItem('filterHistory'));
    if (sessionHome) {
      this.homePropertyData = JSON.parse(sessionStorage.getItem('homeFilter'));
    } else if (this.sessionHistory) {
      this.homePropertyData = JSON.parse(sessionStorage.getItem('filterHistory'));
    }

    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.route.params.subscribe((params) => {
      this.params = params['category'];
      this.categId = params['id'];

      if (this.params == 'rent') {
        this.type = 'RENT';
      } else if (this.params == 'sale') {
        this.type = 'SALE';
      }
    });

    this.authService.getPropertyCategory(this.type).subscribe(
      (res: any) => {
        this.categArray = res.data;
        this.selectedCategory = this.categArray;
      })
    if (this.homePropertyData) {
      if (this.homePropertyData.categoryId) {
        if (this.homePropertyData.categoryId == 'all') {
          this.categId = 'all';
        } else {
          this.categId = Number(this.homePropertyData.categoryId) ? Number(this.homePropertyData.categoryId) : '';
        }
      }
      this.provinceSelect = Number(this.homePropertyData.provinceId) ? Number(this.homePropertyData.provinceId) : '';
      if (this.homePropertyData.provinceId) {
        if (this.homePropertyData.provinceId == "all") {
          this.provinceSelect = 'all';
        } else {
          this.provinceSelect = Number(this.homePropertyData.provinceId) ? Number(this.homePropertyData.provinceId) : '';
          this.cityOpen = true;
          this.authService.getCity(this.provinceSelect).subscribe(
            (res: any) => {
              this.cityList = res.data;
              this.selectedCity = this.cityList;
            });
        }
      }
      if (this.homePropertyData.cityId == 'all') {
        this.cityId = 'all';
      } else {
        this.cityId = Number(this.homePropertyData.cityId) ? Number(this.homePropertyData.cityId) : '';
      }

      if (this.categId) {
        if (this.categId == 'all') {
          this.categId = 'all';
          var categNN = ''
        } else {
          categNN = this.categId;
        }
      } else {
        categNN = this.categId ? this.categId : '';
      }

      if (this.provinceSelect) {
        if (this.provinceSelect == 'all') {
          this.provinceSelect = 'all';
          var provinceSS = ''
        } else {
          provinceSS = this.provinceSelect;
        }
      } else {
        provinceSS = this.provinceSelect ? this.provinceSelect : '';
      }

      if (this.cityId) {
        if (this.cityId == 'all') {
          this.cityId = 'all';
          var cityNN = ''
        } else {
          cityNN = this.cityId;
        }
      } else {
        cityNN = this.cityId ? this.cityId : '';
      }

      this.termsValue = this.homePropertyData.rentalTerm ? this.homePropertyData.rentalTerm : '';
      this.bedsValue = this.homePropertyData.bedsValue ? this.homePropertyData.bedsValue : '';
      this.bathTotValue = this.homePropertyData.noBathrooms ? this.homePropertyData.noBathrooms : '';
      this.priceStartValue = this.homePropertyData.priceStartValue ? this.homePropertyData.priceStartValue : '';
      this.priceEndValue = this.homePropertyData.priceEndValue ? this.homePropertyData.priceEndValue : '';
      this.propAgeValue = this.homePropertyData.propAgeValue ? this.homePropertyData.propAgeValue : '';
      this.areaStartValue = this.homePropertyData.areaStartValue ? this.homePropertyData.areaStartValue : '';
      this.areaEndValue = this.homePropertyData.areaEndValue ? this.homePropertyData.areaEndValue : '';
      this.sortKey = this.homePropertyData.orderbyColumn ? this.homePropertyData.orderbyColumn : '';
      this.sortOrder = this.homePropertyData.orderbyValue ? this.homePropertyData.orderbyValue : '';
      this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
      this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

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
      }

      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
        this.sortOrder, this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount;
            this.postListCount = this.postList.length;
            this.placeMarkers();
          })

      this.clearFiltBtn = true;
    }

    this.bedNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    this.propAgeArray = [{ label: 'below12Years', value: 'below 1-2 years' }, { label: '35Years', value: '3-5 years' },
    { label: '610Years', value: '6-10 years' }, { label: '10Years', value: '10+ Years' }];
    this.bathArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    this.rentalTermArray = [{ label: 'Daily', value: 'Daily' }, { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' }];
    this.sortArray = ['Default', 'NewestToOldest', 'OldestToNewest', 'PriceHighToLow', 'PriceLowToHigh'];

    if (!this.homePropertyData) {
      this.categId = this.categId ? this.categId : '';
      this.authService.getCategoryPropertyPosts(this.categId, this.type, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.rentPostCount) {
            this.totalPostCount = res.rentPostCount[0].Count;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.placeMarkers();
        })
    }

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

  onAllClick() {
    this.scrollSetFunction();
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
      categoryId: this.categId ? this.categId : '',
      provinceId: this.provinceSelect ? this.provinceSelect : '',
      cityId: this.cityId ? this.cityId : '',
      priceStartValue: this.priceStartValue ? this.priceStartValue : '',
      priceEndValue: this.priceEndValue ? this.priceEndValue : '',
      bedsValue: this.bedsValue ? this.bedsValue : '',
      areaStartValue: this.areaStartValue ? this.areaStartValue : '',
      areaEndValue: this.areaEndValue ? this.areaEndValue : '',
      rentalTerm: this.termsValue ? this.termsValue : '',
      noBathrooms: this.bathTotValue ? this.bathTotValue : '',
      propAgeValue: this.propAgeValue ? this.propAgeValue : '',
      orderbyColumn: this.sortKey ? this.sortKey : '',
      orderbyValue: this.sortOrder ? this.sortOrder : '',
      page: event,
      limit: this.tableSize,
    }

    this.authService.getPropProvince(this.type, object.categoryId, object.provinceId, object.cityId,
      object.priceStartValue, object.priceEndValue, object.bedsValue, object.propAgeValue,
      object.areaStartValue, object.areaEndValue, object.noBathrooms, object.rentalTerm, object.orderbyColumn,
      object.orderbyValue, object.page, object.limit).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.rentPostCount) {
            this.totalPostCount = res.rentPostCount[0].Count;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.placeMarkers();
        })
  }

  onCategoryKey(event) {
    this.selectedCategory = this.search(event.target.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.categArray.filter(option =>
      option.name.toLowerCase().startsWith(filter)
    );
  }

  onCategoryChange(value) {
    if (value == 'all') {
      this.categId = 'all'
      var categNN = ''
    } else {
      this.categId = value;
      categNN = value;
    }
    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          if (res.rentPostCount) {
            this.totalPostCount = res.rentPostCount[0].Count;
          } else {
            this.totalPostCount = 0;
          }
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
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
    this.cityOpen = true;
    if (value == 'all') {
      this.provinceSelect = 'all';
      var provinceNN = '';
      this.cityOpen = false;
    } else {
      this.provinceSelect = value;
      provinceNN = value;
      this.cityOpen = true;
    }

    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    this.cityId = '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceNN, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })

    this.authService.getCity(this.provinceSelect).subscribe(
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

    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, this.provinceSelect, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick($event: any) {
    try {
      const target = $event.target as Element;
      const root = document.getElementById('propertyFiltersRoot');
      if (root && target && root.contains(target)) {
        return; // inside component — ignore
      }
    } catch (e) {
      // fallback to closing
    }

    this.showDropdown = false;
    this.showBedDropdown = false;
    this.bathShowDropdown = false;
    this.filterSecShow = false;
    this.sortShow = false;
  }

  dropShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.showBedDropdown = false;
    this.bathShowDropdown = false;
    this.filterSecShow = false;
    this.sortShow = false;
  }

  termsClick(value) {
    this.termsValue = value;
    this.termsPropSubmitFilter();
  }

  termsPropSubmitFilter() {
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.showDropdown = false;
    this.clearFiltBtn = true;
  }

  clearTermsFilter() {
    this.scrollSetFunction();
    this.showDropdown = false;
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  priceStart(event) {
    this.priceStartValue = event.target.value;
  }

  priceEnd(event) {
    this.priceEndValue = event.target.value;
  }

  priceFilter() {
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.showDropdown = false;
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }
  clearPriceFilter() {
    this.scrollSetFunction();
    this.showDropdown = false;
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  bedShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showBedDropdown = !this.showBedDropdown;
    this.showDropdown = false;
    this.bathShowDropdown = false;
    this.filterSecShow = false;
    this.sortShow = false;
  }

  bedsClick(value) {
    this.bedsValue = value;
    this.bedSubmitFilter();
  }

  bedSubmitFilter() {
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.showBedDropdown = false;
    this.clearFiltBtn = true;
  }
  clearBedFilter() {
    this.scrollSetFunction();
    this.showBedDropdown = false;
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
    this.bedsValue = '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  propAgeShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showBedDropdown = false;
    this.showDropdown = false;
    this.filterSecShow = false;
    this.propAgeDropdown = !this.propAgeDropdown;
    this.sortShow = false;
  }
  ageClick(value) {
    this.propAgeValue = value;
  }
  agePropSubmitFilter() {
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.propAgeDropdown = false;
    this.clearFiltBtn = true;
  }
  clearAgePropFilter() {
    this.scrollSetFunction();
    this.propAgeDropdown = false;
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
    this.propAgeValue = '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  bathShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showBedDropdown = false;
    this.showDropdown = false;
    this.filterSecShow = false;
    this.bathShowDropdown = !this.bathShowDropdown;
    this.sortShow = false;
  }

  bathClick(value) {
    this.bathTotValue = value;
    this.bathPropSubmitFilter();
  }

  bathPropSubmitFilter() {
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.bathShowDropdown = false;
    this.clearFiltBtn = true;
  }

  clearbathPropFilter() {
    this.scrollSetFunction();
    this.bathShowDropdown = false;
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
    this.bathTotValue = '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey, this.sortOrder,
      this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
    this.clearFiltBtn = true;
  }

  filterShow($event: any) {
    this.scrollSetFunction();
    $event.stopPropagation();
    this.showBedDropdown = false;
    this.showDropdown = false;
    this.bathShowDropdown = false;
    this.filterSecShow = !this.filterSecShow;
    this.sortShow = false;
  }

  areaStart(event) {
    this.areaStartValue = event.target.value;
  }
  areaEnd(event) {
    this.areaEndValue = event.target.value;
  }

  allFilter() {
    this.scrollSetFunction();
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
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
    this.categId = this.categId ? this.categId : '';
    this.provinceSelect = this.provinceSelect ? this.provinceSelect : '';
    this.cityId = this.cityId ? this.cityId : '';
    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
    this.areaStartValue = '';
    this.areaEndValue = '';
    this.bathTotValue = '';
    this.propAgeValue = '';

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
    }

    this.sortKey = this.sortKey ? this.sortKey : '';
    this.sortOrder = this.sortOrder ? this.sortOrder : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    this.authService.getPropProvince(this.type, this.categId, this.provinceSelect, this.cityId,
      this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
      this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, this.sortKey,
      this.sortOrder, this.page, this.tableSize).subscribe(
        (res: any) => {
          this.postList = res.data;
          this.totalPostCount = res.rentPostCount[0].Count;
          this.postListCount = this.postList.length;
          this.page = 1;
          this.placeMarkers();
        })
  }

  clearFiltersAll() {
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
    this.bathShowDropdown = false;
    this.showBedDropdown = false;
  }

  sortFilter(value) {
    this.scrollSetFunction();
    this.sortedValue = value;
    this.sortShow = false;
    if (this.categId) {
      if (this.categId == 'all') {
        this.categId = 'all';
        var categNN = ''
      } else {
        categNN = this.categId;
      }
    } else {
      categNN = this.categId ? this.categId : '';
    }

    if (this.provinceSelect) {
      if (this.provinceSelect == 'all') {
        this.provinceSelect = 'all';
        var provinceSS = ''
      } else {
        provinceSS = this.provinceSelect;
      }
    } else {
      provinceSS = this.provinceSelect ? this.provinceSelect : '';
    }

    if (this.cityId) {
      if (this.cityId == 'all') {
        this.cityId = 'all';
        var cityNN = ''
      } else {
        cityNN = this.cityId;
      }
    } else {
      cityNN = this.cityId ? this.cityId : '';
    }

    this.priceStartValue = this.priceStartValue ? this.priceStartValue : '';
    this.priceEndValue = this.priceEndValue ? this.priceEndValue : '';
    this.bedsValue = this.bedsValue ? this.bedsValue : '';
    this.propAgeValue = this.propAgeValue ? this.propAgeValue : '';
    this.areaStartValue = this.areaStartValue ? this.areaStartValue : '';
    this.areaEndValue = this.areaEndValue ? this.areaEndValue : '';
    this.bathTotValue = this.bathTotValue ? this.bathTotValue : '';
    this.termsValue = this.termsValue ? this.termsValue : '';
    this.page = this.homePropertyData.page ? this.homePropertyData.page : 1;
    this.tableSize = this.homePropertyData.limt ? this.homePropertyData.limit : 10;

    if (this.sortedValue == 'Default') {
      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, 'id', 'DESC',
        this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount[0].Count;
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'NewestToOldest') {
      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, 'id', 'DESC',
        this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount[0].Count;
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'OldestToNewest') {
      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, 'id', 'ASC',
        this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount[0].Count;
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'PriceHighToLow') {
      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, 'price', 'DESC',
        this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount[0].Count;
            this.postListCount = this.postList.length;
            this.page = 1;
            this.placeMarkers();
          })
    } else if (this.sortedValue == 'PriceLowToHigh') {
      this.authService.getPropProvince(this.type, categNN, provinceSS, cityNN,
        this.priceStartValue, this.priceEndValue, this.bedsValue, this.propAgeValue,
        this.areaStartValue, this.areaEndValue, this.bathTotValue, this.termsValue, 'price', 'ASC',
        this.page, this.tableSize).subscribe(
          (res: any) => {
            this.postList = res.data;
            this.totalPostCount = res.rentPostCount[0].Count;
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
      console.error('Map element not found');
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

        let termsCondition = '';
        if (marker.type == 'RENT') {
          if (marker.rentalTerm == 'Daily') {
            termsCondition += `${this.translate.instant("Daily")}`;
          } else if (marker.type == 'Monthly') {
            termsCondition += `${this.translate.instant("Monthly")}`;
          } else if (marker.type == 'Yearly') {
            termsCondition += `${this.translate.instant("Yearly")}`;
          }
        }

        const dynamicUrl = `/ad-details/property/${marker.id}`;

        const contentString = `
      <a href="${dynamicUrl}" (click)="navigateToRoute(${marker.id})">
        <div class="prod_box">
        <p class="text-center mb-0"><img src="${this.sortImageArray(marker.image)?.[0]?.url || ''}" 
        style="border-radius: 10px;" width="100" height="100"></p>
        <div class="price_det">
        <h6 class="price_tag"> ${riyalImg} ${priceAsCurrency}
        <span>/ ${termsCondition}</span>
       </h6>
       <p class="features">${marker.noBedrooms} ${this.translate.instant("beds")} • 
          ${marker.noBathrooms} ${this.translate.instant("Baths")}</p>
        <p class="locat">${marker.areaInSqmt} ${this.translate.instant("m2")}</p>
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
    this.router.navigateByUrl(`/ad-details/property/${id}'`);
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
      categoryId: this.categId ? this.categId : '',
      provinceId: this.provinceSelect ? this.provinceSelect : '',
      cityId: this.cityId ? this.cityId : '',
      priceStartValue: this.priceStartValue ? this.priceStartValue : '',
      priceEndValue: this.priceEndValue ? this.priceEndValue : '',
      bedsValue: this.bedsValue ? this.bedsValue : '',
      areaStartValue: this.areaStartValue ? this.areaStartValue : '',
      areaEndValue: this.areaEndValue ? this.areaEndValue : '',
      rentalTerm: this.termsValue ? this.termsValue : '',
      noBathrooms: this.bathTotValue ? this.bathTotValue : '',
      propAgeValue: this.propAgeValue ? this.propAgeValue : '',
      orderbyColumn: this.sortKey ? this.sortKey : '',
      orderbyValue: this.sortOrder ? this.sortOrder : '',
      page: this.page ? this.page : 1,
      limit: this.tableSize,
      scrollPosition: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }
    sessionStorage.setItem('filterHistory', JSON.stringify(object));
    sessionStorage.removeItem("homeFilter");
    this.router.navigate([`/ad-details/property/${postid}`]);
  }

  ngOnDestroy(): void {
    this.onStableSub?.unsubscribe();
  }
}
