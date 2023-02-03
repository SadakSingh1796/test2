import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveMatchesComponent } from './live-matches/live-matches.component';
import { LiveLayoutComponent } from './live-layout/live-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { RecentVideosComponent } from './recent-videos/recent-videos.component';
import { EventVideosComponent } from './event-videos/event-videos.component';
import { WttStarContComponent } from './wtt-star-cont/wtt-star-cont.component';
import { LiveMatchesListComponent } from './live-matches/live-matches-list/live-matches-list.component';
import { LiveMatchViewComponent } from './live-matches/live-match-view/live-match-view.component';
import { WttStarMatchesListComponent } from './wtt-star-cont/wtt-star-matches-list/wtt-star-matches-list.component';
import { WttStarMatchesViewComponent } from './wtt-star-cont/wtt-star-matches-view/wtt-star-matches-view.component';
import { RecentVideosListComponent } from './recent-videos/recent-videos-list/recent-videos-list.component';
import { RecentVideosViewComponent } from './recent-videos/recent-videos-view/recent-videos-view.component';
import { EventVideosListComponent } from './event-videos/event-videos-list/event-videos-list.component';
import { EventVideosViewComponent } from './event-videos/event-videos-view/event-videos-view.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: LiveLayoutComponent,
  },
  {
    path: 'live',
    component: LiveMatchesComponent,
  },
  {
    path: 'recent',
    component: RecentVideosComponent,
  },
  {
    path: 'event-videos',
    component: EventVideosComponent,
  },
  {
    path: 'wtt-star',
    component: WttStarContComponent,
  },
  {
    path: 'wtt-star/list',
    component: WttStarMatchesListComponent,
  },
  {
    path: 'live/list',
    component: LiveMatchesListComponent,
  },
  {
    path: 'recent/list',
    component: RecentVideosListComponent,
  },
  {
    path: 'event-videos/list',
    component: EventVideosListComponent,
  },
  {
    path: 'live/view',
    component: LiveMatchViewComponent,
  },
  {
    path: 'recent/view',
    component: RecentVideosViewComponent,
  },
  {
    path: 'event-videos/view',
    component: EventVideosViewComponent,
  },
  {
    path: 'wtt-star/view',
    component: WttStarMatchesViewComponent,
  },
];

@NgModule({
  declarations: [LiveMatchesComponent,
    LiveLayoutComponent,
    RecentVideosComponent,
    EventVideosComponent,
    WttStarContComponent,
    LiveMatchesListComponent,
    LiveMatchViewComponent,
    WttStarMatchesListComponent,
    WttStarMatchesViewComponent,
    RecentVideosListComponent,
    RecentVideosViewComponent,
    EventVideosListComponent,
    EventVideosViewComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CommonSvgMsgComponent, CarouselModule, TooltipModule, DividerModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LiveMatchesModule { }
