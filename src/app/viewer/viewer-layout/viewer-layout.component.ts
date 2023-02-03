import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stupa-viewer-layout',
  templateUrl: './viewer-layout.component.html',
  styleUrls: ['./viewer-layout.component.scss']
})
export class ViewerLayoutComponent implements OnInit {
  _tabList: any = [
    {
      header: 'Fixtures',
      path: 'viewer/$/fixture',
    },
    {
      header: 'Results',
      path: 'viewer/$/results'
    },
    {
      header: 'Rankings',
      path: 'viewer/$/ranking'
    },
    {
      header: 'Videos',
      path: 'viewer/$/videos'
    },
    {
      header: 'Prospectus',
      path: 'viewer/$/prospectus'
    },
  ]
  _tabIndex: any = 0;
  _eventInfo: any = '';
  _eventDetails: any = [];
  constructor(private route: Router) {
   
  }
  ngOnInit(): void {
    this._eventInfo = localStorage.getItem('eventDetailsForViewer')
    this._eventDetails.push(JSON.parse(this._eventInfo))
  }

  getTabIndex(tabIndex: any) {
    this._tabIndex = 1;
    this.route.navigate([this._tabList[tabIndex.index].path])
  }
}
