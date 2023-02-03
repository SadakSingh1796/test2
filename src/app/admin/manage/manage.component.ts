import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  _breadcrumb: any;
  signUpManagement: boolean = false;
  roleManagement: boolean = false;
  memberManagement: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

  currentMangemanet(managementName: any) {
    if (managementName == 'banners') {
      this.roleManagement = false;
      this.memberManagement = false
      this.signUpManagement = true;
      this._breadcrumb = 'Sign Up Fields';
    } else if (managementName == 'brand') {
      this.signUpManagement = false;
      this.memberManagement = false
      this.roleManagement = true;
      this._breadcrumb = 'Create Roles';
    }
    else if (managementName == 'membership') {
      this.signUpManagement = false;
      this.roleManagement = false;
      this.memberManagement = true;
      this._breadcrumb = 'Member';
    }
  }
  goback() {
    this._breadcrumb = '';
    this.signUpManagement = false;
    this.roleManagement = false;
    this.memberManagement = false;
  }
}
