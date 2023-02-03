import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerLayoutComponent } from './viewer-layout/viewer-layout.component';
import { ViewerFixturesComponent } from './viewer-fixtures/viewer-fixtures.component';
import { ViewerResultsComponent } from './viewer-results/viewer-results.component';
import { ViewerRankingsComponent } from './viewer-rankings/viewer-rankings.component';
import { ViewerVideosComponent } from './viewer-videos/viewer-videos.component';
import { ViewerProspectusComponent } from './viewer-prospectus/viewer-prospectus.component';
import { RouterModule, Routes } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventOrganizeModule } from '../event-organize/event-organize.module';
import { ViewerKnockoutComponent } from './viewer-fixtures/viewer-knockout/viewer-knockout.component';
import { ViewerGrpPlayOffComponent } from './viewer-fixtures/viewer-grp-play-off/viewer-grp-play-off.component';
import { ViewerRoundRobinComponent } from './viewer-fixtures/viewer-round-robin/viewer-round-robin.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PdfViewerModule } from 'ng2-pdf-viewer';
const routes: Routes = [
  {
    path: '', component: ViewerFixturesComponent
  },
  {
    path: '$/fixture',
    component: ViewerFixturesComponent,
  },
  {
    path: '$/results',
    component: ViewerResultsComponent
  },
  {
    path: '$/ranking',
    component: ViewerRankingsComponent
    ,
  },
  {
    path: '$/videos',
    component: ViewerVideosComponent
  },
  {
    path: '$/prospectus',
    component: ViewerProspectusComponent
  },
];


@NgModule({
  declarations: [
    ViewerLayoutComponent,
    ViewerFixturesComponent,
    ViewerResultsComponent,
    ViewerRankingsComponent,
    ViewerVideosComponent,
    ViewerProspectusComponent,
    ViewerKnockoutComponent,
    ViewerGrpPlayOffComponent,
    ViewerRoundRobinComponent,
    
    
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    TabViewModule,
    RouterModule.forChild(routes),
    EventOrganizeModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    PdfViewerModule
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewerModule { }
