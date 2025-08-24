import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
  categActive = false;
  profActive = false;
  loggedUser: any;
  userName: any;
  firstName: any;
  parsing: any;
  myAdActive = false;
  myFav = false;
  notifify = false;
  lang: any;
  dir: any;
  profImage: any;
  popNoti = false;
  newNotifNum: number;

  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    public translate: TranslateService, public authService: ApiCallService) { }

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem('saudiDealsLoggedIn');
    var newNotify = localStorage.getItem('SDnotifyNew');
    var oldNotify = localStorage.getItem('SDnotifyOld');
    if (oldNotify != newNotify) {
      this.popNoti = true;
      this.newNotifNum = Number(newNotify) - Number(oldNotify);
      if (this.newNotifNum < 0) this.newNotifNum = 0;
    } else {
      this.popNoti = false;
    }
    this.lang = sessionStorage.getItem("lang") || "ar";
    this.translate.use(this.lang);
    this.dir = sessionStorage.getItem("dir") || "rtl"

    if (this.loggedUser == 'true') {
      this.authService.getUser().subscribe(
        (res: any) => {
          this.userName = res?.userDetails[0]?.userName;
          this.profImage = res?.userDetails[0]?.image;
          if (res?.userDetails[0]?.active == 0) {
            this.logOut();
          }
        })
    }
  }
  categClick() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    if (this.loggedUser == 'true') {
      this.router.navigate([`/my_favourite`]);
    } else {
      sessionStorage.setItem('myFavourite', ('true'));
      this.router.navigate([`/login`]);
    }
    this.profActive = false;
  }
  closeCateg() {
    this.categActive = false;
    this.profActive = false;
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
  }
  notifClick() {
    this.profActive = false;
    if (this.loggedUser == 'true') {
      this.router.navigate([`/notifications`]);
    } else {
      sessionStorage.setItem('notification', ('true'));
      this.router.navigate([`/login`]);
    }
  }
  proffClick() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.profActive = !this.profActive;
    this.categActive = false;
  }
  adBtnClick() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.categActive = false;
    this.profActive = false;
    if (this.loggedUser == 'true') {
      this.router.navigate([`/category`]);
    } else {
      sessionStorage.setItem('placeAd', ('true'));
      this.router.navigate([`/login`]);
    }
  }
  myAd() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.categActive = false;
    this.profActive = false;
    this.myAdActive = true;
    this.myFav = false;
    this.notifify = false;
    if (this.loggedUser == 'true') {
      this.router.navigate([`/my_ads`]);
    } else {
      sessionStorage.setItem('myAd', ('true'));
      this.router.navigate([`/login`]);
    }
  }

  myFavorite() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.categActive = false;
    this.profActive = false;
    this.myAdActive = false;
    this.notifify = false;
    this.myFav = true;
    if (this.loggedUser == 'true') {
      this.router.navigate([`/my_favourite`]);
    } else {
      sessionStorage.setItem('myFavourite', ('true'));
      this.router.navigate([`/login`]);
    }
  }

  myNotification() {
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.categActive = false;
    this.profActive = false;
    this.myAdActive = false;
    this.notifify = true;
    this.myFav = false;
    if (this.loggedUser == 'true') {
      this.router.navigate([`/notifications`]);
    } else {
      sessionStorage.setItem('notification', ('true'));
      this.router.navigate([`/login`]);
    }
  }

  homepage() {
    this.myAdActive = false;
    this.myFav = false;
    this.notifify = false;
    this.router.navigate([`/`]);
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
  }

  switchLang(lang: any) {
    if (lang == "ar") {
      var dir = "rtl";
    } else {
      var dir = "ltr";
    }
    sessionStorage.setItem("lang", lang);
    sessionStorage.setItem("dir", dir);
    // console.log("lang",localStorage)
    window.location.reload();
  }

  logOut() {
    this.toastr.success("Success", "Logout Successfully");
    this.router.navigate(['/']);
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  }
}
