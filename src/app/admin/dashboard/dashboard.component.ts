import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  favIcon: any = document.querySelector('#appIcon');
  constructor() {
    document.title = "CBTM Admin"
  }

  ngOnInit(): void {
  }

}
