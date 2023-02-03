import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcast-only',
  templateUrl: './broadcast-only.component.html',
  styleUrls: ['./broadcast-only.component.scss']
})
export class BroadcastOnlyComponent implements OnInit {
  _pageMainTitle: any = 'Under Development!';
  _pageSubTitle: any = 'We Will Get Back To you soon.';
  _buttonTitle: any = 'Create Matches';

  constructor(private router: Router) {}

  ngOnInit(): void {}
  eventClicked() {
    this.router.navigateByUrl('/home/organize');
  }
}
