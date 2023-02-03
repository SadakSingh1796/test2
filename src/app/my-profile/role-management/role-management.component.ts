import { Component } from '@angular/core';

@Component({
  selector: 'stupa-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class RoleManagementComponent {
  cards = [
    {
      profilename: 'athlete',
      name: 'govind singh',
      email: 'asdf@gmail.com',
      info: 'asdf',
    },
    {
      profilename: 'Umpire',
      name: 'asdf asdf',
      email: 'asdf@gmail.com',
      info: 'kljwerhvlkjqb ',
    }
  ];
}
