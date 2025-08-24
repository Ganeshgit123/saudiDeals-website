import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-terms-page',
    templateUrl: './terms-page.component.html',
    styleUrls: ['./terms-page.component.css'],
    standalone: false
})

export class TermsPageComponent {
  getLists: any;
  
  constructor( private router: Router, private route: ActivatedRoute, public authService: ApiCallService,) { }

  ngOnInit(): void {
    this.authService.getTerms().subscribe(
      (res: any) => {
        this.getLists = res.data;
      }
    );
  }

}
