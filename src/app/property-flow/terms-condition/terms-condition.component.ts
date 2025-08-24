import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-terms-condition',
    templateUrl: './terms-condition.component.html',
    styleUrls: ['./terms-condition.component.css'],
    standalone: false
})
export class TermsConditionComponent {
  categ:any;
  subId:any;

  constructor( private router: Router, private route: ActivatedRoute,) { }
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
       this.categ = params['category'];
      this.subId = params['id'];
    });
  }
}
