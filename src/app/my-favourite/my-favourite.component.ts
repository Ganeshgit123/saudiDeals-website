import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-my-favourite',
    templateUrl: './my-favourite.component.html',
    styleUrls: ['./my-favourite.component.css'],
    standalone: false
})
export class MyFavouriteComponent {
  motorFavArray: any = [];
  propertyFavArray: any = [];
  motorFavCount: any;
  mainCategId: any;
  subCategId: any;
  subSubCategId: any;
  propFavCount: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.getMotorFavorites().subscribe(
      (res: any) => {
        this.motorFavArray = res.data;
        this.motorFavCount = this.motorFavArray.length;
      })

    this.authService.getPropertyFavorites().subscribe(
      (res: any) => {
        this.propertyFavArray = res.data;
        this.propFavCount = this.propertyFavArray.length;
      })
  }

  sortImageArray(images: any[]): any[] {
    return images.sort((a, b) => a.order - b.order);
  }

  unfavMotorClick(id) {
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
  }

  unFavPropertyClick(id) {
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
  }
}
