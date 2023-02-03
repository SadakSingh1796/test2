import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  _window: any;
  innerWidth: any;
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this._window = window.pageYOffset;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _tabIndex: any = 0;
  @Input() tabIndex: any;
  tabToIndex: any
  constructor() {

    if (localStorage.getItem('isOpenDayPlanner') == 'true') {
      localStorage.removeItem('isOpenDayPlanner')
      this._tabIndex =7
    }else{
      this._tabIndex =0
    }
    this._window = window.pageYOffset;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void { }
  goback() { }
  srollTop() {

    window.scrollTo(0, 0);
    window.pageXOffset + window.pageYOffset;
  }
  getTabIndex(tabIndex: any) {
    this._tabIndex = 1;
  }
  eventClicked() {
    this._tabIndex = 0;
  }
}
