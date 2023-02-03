import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LandpageComponent } from './landpage.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ButtonModule } from 'primeng/button';
import { BuyMembershipComponent } from './buy-membership/buy-membership.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventOrganizComponent } from './event-organiz/event-organiz.component';
import { HomeComponent } from './home/home.component';
import { AllOngoingComponent } from './home/all-ongoing/all-ongoing.component';
import {TableModule} from 'primeng/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllUpcomingComponent } from './home/all-upcoming/all-upcoming.component';
import { AllRecentsComponent } from './home/all-recents/all-recents.component';
import { AllRegistrationComponent } from './home/all-registration/all-registration.component';
import { AllLiveMatchesComponent } from './home/all-live-matches/all-live-matches.component';
import { InputTextModule } from 'primeng/inputtext';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
const routes: Routes = [
  // {
  //   path: '',
  //   component: LandpageComponent,
  // },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'buy-membership',
    component: BuyMembershipComponent,
  },
  {
    path: 'organize',
    component: EventOrganizComponent,
  },
  {
    path: 'svg',
    component: CommonSvgMsgComponent,
  },
  {
    path: 'xyz',
    component: LandpageComponent,
  },
  {
    path: 'all-ongoing-events/:id',
    component: AllOngoingComponent,
  },
  {
    path: 'all-upcoming-events/:id',
    component: AllUpcomingComponent,
  },
  {
    path: 'all-live',
    component: AllLiveMatchesComponent,
  },
  {
    path: 'all-recent',
    component: AllRecentsComponent,
  },
  {
    path: 'all-registrations',
    component: AllRegistrationComponent,
  },

];

@NgModule({
  declarations: [LandpageComponent, BuyMembershipComponent,HomeComponent,AllOngoingComponent, AllUpcomingComponent, AllRecentsComponent, AllRegistrationComponent, AllLiveMatchesComponent],
  entryComponents: [],
  imports: [
    ButtonModule,
    InputSwitchModule,
    CommonModule,
    CarouselModule,
    TranslateModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgxPaginationModule,
    InputTextModule,
    GifLoaderComponent,
    CommonSvgMsgComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule { }
