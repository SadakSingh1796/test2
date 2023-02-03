import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent implements OnInit {
  @Output() closeSide = new EventEmitter<any>();
  activeTab: string = 'dashboard';
  constructor() {
    if (window.location.href.split('/')[5] == undefined) {
      this.activeTab = 'dashboard';
    } else {
      this.activeTab = window.location.href.split('/')[5]
    }
  }

// display=true;
//   toggle(){
//     // alert("clicked");

//     this.display=!this.display;
//   }





  
  currentTab(data: string) {
    this.activeTab = data;
    this.closeSide.emit(false);
  }
  ngOnInit(): void { }
}
