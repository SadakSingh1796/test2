import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/Account/account.service';
import { RoleService } from 'src/app/services/RoleService/role.service';

@Component({
  selector: 'app-create-role-dialog',
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.scss'],
})
export class CreateRoleDialogComponent implements OnInit {
  /* Variables */
  roles: any = '';
  permissions: any = '';
  permission: any = '';
  authentication: any = '';
  name: any = '';
  @Output() closePopUp = new EventEmitter<any>();
  constructor(private roleService: RoleService) { }
  ngOnInit(): void {
    this.getRoles();
    this.getAccessPermissions();
  }
  getRoles() {
    this.roleService.getRoles().subscribe(
      {
        next: (result: any) => {
          this.roles = result.body;
        },
        error: (result) => {

        },
        complete: () => console.info('complete')
      }
    );
  }
  getAccessPermissions() {
    this.roleService.getAccessPermissions().subscribe(
      (res: any) => {
        this.permissions = res;

      },
      (error: any) => { }
    );
  }
  saveRole() {
    var data = {
      "title": this.name,
      "description": "",
      "verified_by": this.authentication,
      "needs_admin": true,
      "perm_ids": [
       1
      ]
    }
    // this.roleService.createRole(data).subscribe(
    //   {
    //     next: (result: any) => {
        
    //     },
    //     error: (result:any) => {

    //     },
    //     complete: () => console.info('complete')
    //   }
    // );
    this.closePopUp.emit(false);
  }
}
