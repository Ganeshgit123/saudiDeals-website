import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-logo-header',
  templateUrl: './logo-header.component.html',
  styleUrls: ['./logo-header.component.css'],
  standalone: false
})
export class LogoHeaderComponent {

  constructor(private router: Router, private route: ActivatedRoute) { }
  goBack() {
    window.history.back();
  }
  home() {
    sessionStorage.removeItem("postId");
    sessionStorage.removeItem("homeFilter");
    sessionStorage.removeItem("motorHistory");
    sessionStorage.removeItem("filterHistory");
    this.router.navigate(['/']);
  }
}
