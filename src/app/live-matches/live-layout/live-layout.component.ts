import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-live-layout',
  templateUrl: './live-layout.component.html',
  styleUrls: ['./live-layout.component.scss'],
})
export class LiveLayoutComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit(): void { }
  eventClicked() {
    this.router.navigateByUrl('/home/organize');
  }

}
