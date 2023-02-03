import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { RouterModule, Routes } from '@angular/router';
import { DshboardSingleComponent } from './dshboard-single/dshboard-single.component';
import { DshboardTeamsComponent } from './dshboard-teams/dshboard-teams.component';
import { DshboardDoublesComponent } from './dshboard-doubles/dshboard-doubles.component';
import { DshboardMixDoublesComponent } from './dshboard-mix-doubles/dshboard-mix-doubles.component';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { CreateTeamComponent } from './dshboard-teams/create-team/create-team.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestsComponent } from '../shared/requests/requests.component';
import { OrderHistoryComponent } from '../shared/order-history/order-history.component';
import { MyAccountComponent } from '../shared/my-account/my-account.component';
import { CreateDoublesComponent } from './dshboard-doubles/create-doubles/create-doubles.component';
import { TableModule } from 'primeng/table';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { CreateMixDouble } from './dshboard-mix-doubles/create-mix-double/create-mix-double.component';
import { PlayerDetailsComponent } from './dshboard-single/player-details/player-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMainComponent,
  },
  {
    path: 'dashboard-main',
    component: DashboardMainComponent,
  },
  {
    path: 'dashboard-single',
    component: DshboardSingleComponent,
  },
  {
    path: 'dashboard-teams',
    component: DshboardTeamsComponent,
  },
  {
    path: 'dashboard-doubles',
    component: DshboardDoublesComponent,
  },
  {
    path: 'dashboard-mix-doubles',
    component: DshboardMixDoublesComponent,
  },
  {
    path: 'request',
    component: RequestsComponent,
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent,
  },
];
@NgModule({
  declarations: [
    DashboardMainComponent,
    DshboardSingleComponent,
    DshboardTeamsComponent,
    DshboardDoublesComponent,
    DshboardMixDoublesComponent,
    CreateTeamComponent,
    CreateDoublesComponent,
    CreateMixDouble,
    PlayerDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DividerModule,
    InputTextModule,
    AvatarGroupModule,
    AvatarModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    GifLoaderComponent,
    TranslateModule,
    ToastModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
