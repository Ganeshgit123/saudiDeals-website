import { Component, OnInit, NgZone, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css'],
  standalone: false
})
export class AdDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  private onStableSub?: Subscription;
  postArray: any = [];
  params: any;
  category: any;
  mainCategoryName: any;
  subCategoryName: any;
  subSubCategoryName: any;
  makeName: any;
  modelName: any;
  propCategName: any;
  items: GalleryItem[] = [];
  galleryView: any[] = [];
  userId: any;
  userData: any[] = [];
  currenturl: any;
  loggedUser: any;
  mainCategId: any;
  subCategId: any;
  subSubCategId: any;
  propCategId: any;
  proType: any;
  motorFavArray = [];
  motoFavLength: number = 0;
  propertyFavArray = [];
  propertyFavLength: number = 0;

  constructor(public authService: ApiCallService,
    private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem('saudiDealsLoggedIn');
    this.route.params.subscribe((params) => {
      this.params = params['id'];
      this.category = params['categ'];
    });
    this.currenturl = this.router.url;
    if (this.category == 'motors') {
      this.authService.getPostedPost(this.params).subscribe(
        (res: any) => {
          this.postArray = res.data;
          this.mainCategoryName = this.postArray[0].mainMotorCategoryName;
          this.mainCategId = this.postArray[0].mainMotorCategoryId;
          this.subCategoryName = this.postArray[0].motorCategoryName;
          this.subCategId = this.postArray[0].motorCategoryId;
          this.subSubCategoryName = this.postArray[0].motorSubCategoryName;
          this.subSubCategId = this.postArray[0].motorSubCategoryId;
          this.makeName = this.postArray[0].make;
          this.modelName = this.postArray[0].model;
          this.userId = this.postArray[0].id;
          const sortedImage = this.postArray[0].image.sort(function (first, second) {
            return first.order - second.order;
          });
          sortedImage.forEach((element: any) => {
            const object = {
              srcUrl: element.url,
              previewUrl: element.url
            }
            this.galleryView.push(object);
          });

          this.items = this.galleryView.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));

          var userId = this.postArray[0].userId.toString();

          this.authService.getPostUser(userId).subscribe((res: any) => {
            this.userData = res.userDetails;
          })
        });
      if (this.loggedUser == 'true') {
        this.authService.getMotorFavorites().subscribe(
          (res: any) => {
            this.motorFavArray = res.data.filter(element => {
              return element.id == this.params;
            });
            this.motoFavLength = this.motorFavArray.length;
          })
      }
    } else if (this.category == 'property') {
      this.authService.getPostedPrpertyPost(this.params).subscribe(
        (res: any) => {
          this.postArray = res.data;
          this.propCategName = this.postArray[0].enCategoryName;
          this.propCategId = this.postArray[0].categoryId;
          this.proType = this.postArray[0].type.toLowerCase();
          this.userId = this.postArray[0].id;
          const sortedImage = this.postArray[0].image.sort(function (first, second) {
            return first.order - second.order;
          });
          sortedImage.forEach((element: any) => {
            const object = {
              srcUrl: element.url,
              previewUrl: element.url
            }
            this.galleryView.push(object);
          });

          //  console.log("img",this.galleryView) 

          this.items = this.galleryView.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
          var userId = this.postArray[0].userId.toString();

          this.authService.getPostUser(userId).subscribe((res: any) => {
            this.userData = res.userDetails;
          })
        })
      if (this.loggedUser == 'true') {
        this.authService.getPropertyFavorites().subscribe(
          (res: any) => {
            this.propertyFavArray = res.data.filter(element => {
              return element.id == this.params;
            });
            this.propertyFavLength = this.propertyFavArray.length;
          })
      }
    }
  }

  ngAfterViewInit(): void {
    this.onStableSub = this.ngZone.onStable.subscribe(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Detect the correct scrollable element (iOS sometimes ignores window/body)
          const scrollEl = document.scrollingElement || document.documentElement;

          // Reset scroll position (covers iOS + Android)
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          scrollEl.scrollTop = 0;

          // Force reflow (iOS Safari quirk)
          void (scrollEl as HTMLElement).offsetHeight;

          this.onStableSub?.unsubscribe();
        }, 100); // Slightly longer delay for iOS layout
      });
    });
  }


  showPhone(content) {
    this.modalService.open(content, { centered: true });
  }

  favMotorClick(id) {
    if (this.loggedUser == 'true') {
      const Object = {
        productId: id,
        isFavourites: 1
      }
      // console.log("ffe",Object)
      this.authService.motorFavouriteUnfavourite(Object)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else {
      sessionStorage.setItem('adDetails', ('true'));
      const object = {
        adId: this.params ? this.params : '',
        category: this.category ? this.category : '',
      }
      sessionStorage.setItem('favAdDetail', JSON.stringify(object));
      this.router.navigate([`/login`]);
    }
  }

  unfavMotorClick(id) {
    if (this.loggedUser == 'true') {
      const Object = {
        productId: id,
        isFavourites: 0
      }
      // console.log("ffe",Object)
      this.authService.motorFavouriteUnfavourite(Object)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else {
      sessionStorage.setItem('adDetails', ('true'));
      const object = {
        adId: this.params ? this.params : '',
        category: this.category ? this.category : '',
      }
      sessionStorage.setItem('favAdDetail', JSON.stringify(object));
      this.router.navigate([`/login`]);
    }
  }

  favPropertyClick(id) {
    if (this.loggedUser == 'true') {
      const Object = {
        productId: id,
        isFavourites: 1
      }
      // console.log("ffe",Object)
      this.authService.propertyFavouriteUnfavourite(Object)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else {
      sessionStorage.setItem('adDetails', ('true'));
      const object = {
        adId: this.params ? this.params : '',
        category: this.category ? this.category : '',
      }
      sessionStorage.setItem('favAdDetail', JSON.stringify(object));
      this.router.navigate([`/login`]);
    }
  }

  unFavPropertyClick(id) {
    if (this.loggedUser == 'true') {
      const Object = {
        productId: id,
        isFavourites: 0
      }
      // console.log("ffe",Object)
      this.authService.propertyFavouriteUnfavourite(Object)
        .subscribe((res: any) => {
          if (res.success == true) {
            this.toastr.success('Success', res.massage);
            this.ngOnInit();
          } else {
            this.toastr.error('Error', res.massage);
          }
        })
    } else {
      sessionStorage.setItem('adDetails', ('true'));
      const object = {
        adId: this.params ? this.params : '',
        category: this.category ? this.category : '',
      }
      sessionStorage.setItem('favAdDetail', JSON.stringify(object));
      this.router.navigate([`/login`]);
    }
  }

  shareBtn(shareContent) {
    this.modalService.open(shareContent, { centered: true });
  }

  filterClick(value) {
    if (value == 'main') {
      const object = {
        mainMotorCategoryId: this.mainCategId ? this.mainCategId : '',
        motorCategoryId: '',
        motorSubCategoryId: '',
        make: '',
        model: ''
      }
      sessionStorage.setItem('motorHistory', JSON.stringify(object));
      this.router.navigate([`/motors_filter/${this.mainCategId}`]);
    } else if (value == 'sub') {
      const object = {
        mainMotorCategoryId: this.mainCategId ? this.mainCategId : '',
        motorCategoryId: this.subCategId ? this.subCategId : '',
        motorSubCategoryId: '',
        make: '',
        model: ''
      }
      sessionStorage.setItem('motorHistory', JSON.stringify(object));
      this.router.navigate([`/motors_filter/${this.mainCategId}`]);
    } else if (value == 'subSub') {
      const object = {
        mainMotorCategoryId: this.mainCategId ? this.mainCategId : '',
        motorCategoryId: this.subCategId ? this.subCategId : '',
        motorSubCategoryId: this.subSubCategId ? this.subSubCategId : '',
        make: '',
        model: ''
      }
      sessionStorage.setItem('motorHistory', JSON.stringify(object));
      this.router.navigate([`/motors_filter/${this.mainCategId}`]);
    } else if (value == 'make') {
      const object = {
        mainMotorCategoryId: this.mainCategId ? this.mainCategId : '',
        motorCategoryId: this.subCategId ? this.subCategId : '',
        motorSubCategoryId: this.subSubCategId ? this.subSubCategId : '',
        make: this.makeName ? this.makeName : '',
        model: ''
      }
      sessionStorage.setItem('motorHistory', JSON.stringify(object));
      this.router.navigate([`/motors_filter/${this.mainCategId}`]);
    } else if (value == 'model') {
      const object = {
        mainMotorCategoryId: this.mainCategId ? this.mainCategId : '',
        motorCategoryId: this.subCategId ? this.subCategId : '',
        motorSubCategoryId: this.subSubCategId ? this.subSubCategId : '',
        make: this.makeName ? this.makeName : '',
        model: this.modelName ? this.modelName : ''
      }
      sessionStorage.setItem('motorHistory', JSON.stringify(object));
      this.router.navigate([`/motors_filter/${this.mainCategId}`]);
    }
  }

  propClick() {
    const object = {
      categoryId: this.propCategId ? this.propCategId : '',
      provinceId: '',
      cityId: '',
      rentalTerm: '',
      noBedrooms: '',
      noBathrooms: '',
    }
    sessionStorage.setItem('motorHistory', JSON.stringify(object));
    if (this.propCategId) {
      this.router.navigate([`/property_filter/${this.proType}/${this.propCategId}`]);
    } else {
      this.router.navigate([`/property_filter/${this.proType}`]);
    }
  }

  redirectToGoogleMap(lat, lng) {
    // Construct the Google Maps URL with the latitude and longitude
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    // Redirect to Google Maps
    window.location.href = googleMapsUrl;
  }

  ngOnDestroy(): void {
    this.onStableSub?.unsubscribe();
  }
}
