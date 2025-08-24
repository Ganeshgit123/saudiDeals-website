import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false,
})
export class FooterComponent {
  year: any;
  lang: any;
  dir: any;

  constructor(public translate: TranslateService,) { }

  ngOnInit(): void {
    this.lang = sessionStorage.getItem("lang") || "ar";
    this.translate.use(this.lang);
    this.dir = sessionStorage.getItem("dir") || "rtl"
    this.year = new Date().getFullYear()
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
}
