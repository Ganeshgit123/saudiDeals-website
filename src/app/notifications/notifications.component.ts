import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    standalone: false
})
export class NotificationsComponent {
  notifyArray = [];
  notifylength: any;
  page: number = 1;
  tableSize: number = 10;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.getNotification().subscribe(
      (res: any) => {
        this.notifylength = res.data.length;
        localStorage.setItem('SDnotifyOld', res.data.length)
      })
    this.limitedData();
  }

  limitedData() {
    this.authService.getNotificationwithPAge(this.page, this.tableSize).subscribe(
      (res: any) => {
        this.notifyArray = res.data;
      })
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.limitedData();
  }

  clearNotify() {
    this.authService.clearNotification()
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
          localStorage.removeItem('SDnotifyNew')
          this.ngOnInit();
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }
}
