import { Component } from '@angular/core';
import { OwlOptions } from "ngx-owl-carousel-o";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
  standalone: false
})
export class PropertyComponent {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-circle-left"></i>',
      '<i class="fa fa-chevron-circle-right"></i>',
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      }
    },
    nav: true,
    rtl: true,
  }

  countValue: any;
  recentProperty = [];
  progCategArray = [];
  bedNumber = [];
  propAgeArray = [];
  bathArray = [];
  propSecondCategActive: any;
  propCategValue: any;
  proTermValue: any;
  bedValue: any;
  bathValue: any;
  dir: any;
  provinceId: any;
  cityList = [];
  provinceList = [];
  cityId: any;
  cityActive = false;
  rentalTermArray = [];
  recentPropLength: number;
  params: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.params = params['type'] || 'Rent';
    });
    this.dir = sessionStorage.getItem('dir') || 'rtl';

    if (this.params == 'Rent') {
      this.authService.getPropetyCount("RENT").subscribe(
        (res: any) => {
          this.countValue = res.data[0];
        })

      this.authService.getRecentProperty("RENT").subscribe(
        (res: any) => {
          let exipryCondition = res.data;
          this.recentPropLength = exipryCondition.length;
          this.recentProperty = exipryCondition.slice(0, 5);
        })
      this.authService.getPropertyCategory("RENT").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
          this.progCategArray = sortedByName;
        })
    } else if (this.params == 'Sale') {
      this.authService.getPropetyCount("SALE").subscribe(
        (res: any) => {
          this.countValue = res.data[0];
        })

      this.authService.getRecentProperty("SALE").subscribe(
        (res: any) => {
          let exipryCondition = res.data;
          this.recentPropLength = exipryCondition.length;
          this.recentProperty = exipryCondition.slice(0, 5);
        })
      this.authService.getPropertyCategory("SALE").subscribe(
        (res: any) => {
          const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
          this.progCategArray = sortedByName;
        })
    }

    this.bedNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    this.propAgeArray = [{ label: 'below12Years', value: 'below 1-2 years' }, { label: '35Years', value: '3-5 years' },
    { label: '610Years', value: '6-10 years' }, { label: '10Years', value: '10+ Years' }];
    this.bathArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    this.rentalTermArray = [{ label: 'Daily', value: 'Daily' }, { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' }];
    // get All Provinces
    this.authService.getProvince().subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
        this.provinceList = sortedByName;
      })
    this.propSecondCategActive = this.params;
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }

  propCategActive(data) {
    this.propSecondCategActive = data;
    this.authService.getPropertyCategory(this.propSecondCategActive).subscribe(
      (res: any) => {
        const sortedByName = res.data.sort((a, b) => a.name.localeCompare(b.name));
        this.progCategArray = sortedByName;
      })
    this.authService.getRecentProperty(this.propSecondCategActive).subscribe(
      (res: any) => {
        let exipryCondition = res.data;
        this.recentPropLength = exipryCondition.length;
        this.recentProperty = exipryCondition.slice(0, 5);
      })
    this.authService.getPropetyCount(this.propSecondCategActive).subscribe(
      (res: any) => {
        this.countValue = res.data[0];
      })
  }

  propCategSelect(id) {
    this.propCategValue = id;
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

  bedValueClick(id) {
    this.bedValue = id;
  }

  bathClick(id) {
    this.bathValue = id;
  }

  termClick(id) {
    this.proTermValue = id;
  }

  propertySearch() {
    sessionStorage.removeItem("filterHistory");
    if (this.propSecondCategActive == 'Rent') {
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
        this.router.navigate([`/property_filter/rent/${this.propCategValue}`]);
      } else {
        this.router.navigate([`/property_filter/rent`]);
      }
    } else if (this.propSecondCategActive == 'Sale') {
      const object = {
        categoryId: this.propCategValue ? this.propCategValue : '',
        provinceId: this.provinceId ? this.provinceId : '',
        cityId: this.cityId ? this.cityId : '',
        noBedrooms: this.bedValue ? this.bedValue : '',
        noBathrooms: this.bathValue ? this.bathValue : '',
      }
      sessionStorage.setItem('homeFilter', JSON.stringify(object));
      if (this.propCategValue) {
        this.router.navigate([`/property_filter/sale/${this.propCategValue}`]);
      } else {
        this.router.navigate([`/property_filter/sale`]);
      }
    }
  }

  boxClick(id, type) {
    sessionStorage.removeItem("filterHistory");
    if (type == 'Rent') {
      const object = {
        categoryId: id,
        provinceId: this.provinceId ? this.provinceId : '',
        cityId: this.cityId ? this.cityId : '',
        rentalTerm: this.proTermValue ? this.proTermValue : '',
        noBedrooms: this.bedValue ? this.bedValue : '',
        noBathrooms: this.bathValue ? this.bathValue : '',
      }
      sessionStorage.setItem('homeFilter', JSON.stringify(object));
      if (this.propCategValue) {
        this.router.navigate([`/property_filter/rent/${id}`]);
      } else {
        this.router.navigate([`/property_filter/rent`]);
      }
    } else if (type == 'Sale') {
      const object = {
        categoryId: id,
        provinceId: this.provinceId ? this.provinceId : '',
        cityId: this.cityId ? this.cityId : '',
        noBedrooms: this.bedValue ? this.bedValue : '',
        noBathrooms: this.bathValue ? this.bathValue : '',
      }
      sessionStorage.setItem('homeFilter', JSON.stringify(object));
      if (this.propCategValue) {
        this.router.navigate([`/property_filter/sale/${id}`]);
      } else {
        this.router.navigate([`/property_filter/sale`]);
      }
    }
  }
}
