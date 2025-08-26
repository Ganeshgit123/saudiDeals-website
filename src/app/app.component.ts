import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import {
  Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel,
  NavigationError, RouteConfigLoadStart, RouteConfigLoadEnd
} from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  private navSub?: Subscription;

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  title = 'saudideals';
  isLoading: any;
  constructor(private router: Router, private translateservice: TranslateService) {
    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
    const lang = sessionStorage.getItem("lang") || "ar";
    const dir = sessionStorage.getItem("dir") || "rtl";
    this.translateservice.use(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }
  lang: any;
  dir: any;
  header: any;
  footer: any;
  logoHeader: any;
  ngOnInit(): void {
    // Prevent Angular from forcing scroll resets
    this.navSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Do nothing → let iOS handle scroll restore
      }
    });

    // Fix iOS BFCache delayed restore
    window.onpageshow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Safari restored from cache → force repaint to smooth scroll
        requestAnimationFrame(() => {
          const scrollEl = document.scrollingElement || document.documentElement;
          scrollEl.scrollTop = scrollEl.scrollTop; // trigger reflow
        });
      }
    };
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          var activeUrl = event.url.split('/');
          activeUrl.splice(0, 1)
          var getUrl = activeUrl[0];
          this.header = (event.url == '/' || event.url == '/motors' || event.url == '/property'
            || event.url == '/property_sale' || event.url == '/my_ads' || getUrl == 'ad-details'
            || event.url == '/contact-us' || event.url == '/my_favourite' || getUrl == 'motors_filter'
            || getUrl == 'property_filter' || event.url == '/notifications' || event.url == '/about-us')
        }
        if (event instanceof NavigationEnd) {
          var activeUrl = event.url.split('/');
          activeUrl.splice(0, 1)
          var getUrl = activeUrl[0];
          this.footer = (event.url == '/' || event.url == '/motors' || event.url == '/property'
            || event.url == '/property_sale' || event.url == '/my_ads' || getUrl == 'ad-details'
            || event.url == '/contact-us' || event.url == '/my_favourite' || getUrl == 'motors_filter'
            || getUrl == 'property_filter' || event.url == '/notifications' || event.url == '/about-us')
        }
        if (event instanceof NavigationEnd) {
          var activeUrl = event.url.split('/');
          activeUrl.splice(0, 1)
          var getUrl = activeUrl[0];
          this.logoHeader = (event.url !== '/' && event.url !== '/motors' && event.url !== '/property'
            && event.url !== '/property_sale' && event.url !== '/my_ads' && getUrl !== 'ad-details'
            && event.url !== '/login' && event.url !== '/contact-us' && event.url !== '/my_favourite'
            && getUrl !== 'motors_filter' && getUrl !== 'property_filter' && event.url !== '/notifications'
            && event.url !== '/about-us')
        }
      });
    this.lang = sessionStorage.getItem("lang") || "ar";
    this.dir = sessionStorage.getItem("dir") || "rtl";
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }
}
