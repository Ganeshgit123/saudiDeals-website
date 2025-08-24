import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
    selector: 'app-motor-terms',
    templateUrl: './motor-terms.component.html',
    styleUrls: ['./motor-terms.component.css'],
    standalone: false
})
export class MotorTermsComponent {
  params:any;
  subParams: any;
  subSubParams: any;

  constructor( private router: Router, private route: ActivatedRoute,public authService: ApiCallService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.params = params['categ'];
      this.subParams = params['subcateg'];
      this.subSubParams = params['subSubcateg'];
    });

  }
}
