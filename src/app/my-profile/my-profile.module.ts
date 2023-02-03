import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileLayoutComponent } from './my-profile-layout/my-profile-layout.component';
import { MyProfileSidebarComponent } from './my-profile-sidebar/my-profile-sidebar.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MemberShipsComponent } from './member-ships/member-ships.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { DeteteAccountComponent } from './detete-account/detete-account.component';
import { RouterModule, Routes } from '@angular/router';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {InputTextModule} from 'primeng/inputtext';


const routes: Routes = [
  {
    path: '',
    component: PersonalDetailsComponent,
  },
  {
    path: 'personal-info',
    component: PersonalDetailsComponent,
  },
  {
    path: 'role',
    component: RoleManagementComponent,
  },
  {
    path: 'membership',
    component: MemberShipsComponent,
  },
  {
    path: 'my-event',
    component: MyEventsComponent,
  },
  {
    path: 'delete-account',
    component: DeteteAccountComponent,
  }
];

@NgModule({
  declarations: [
    MyProfileLayoutComponent,
    MyProfileSidebarComponent,
    PersonalDetailsComponent,
    RoleManagementComponent,
    MemberShipsComponent,
    MyEventsComponent,
    DeteteAccountComponent,
  ],
  imports: [
    CommonModule,
    AvatarModule,
    AvatarGroupModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyProfileModule { }
