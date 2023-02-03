import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenRegistrationComponent } from './open-registration/open-registration.component';
import { RegisterComponent } from './register/register.component';
import { RegSingleComponent } from './reg-single/reg-single.component';
import { RegTeamsComponent } from './reg-teams/reg-teams.component';
import { RegDoublesComponent } from './reg-doubles/reg-doubles.component';
import { RegMixDoublesComponent } from './reg-mix-doubles/reg-mix-doubles.component';
import { RouterModule, Routes } from '@angular/router';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {DividerModule} from 'primeng/divider';
import {AvatarModule} from 'primeng/avatar';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { NgxPaginationModule } from 'ngx-pagination';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
const routes: Routes = [
  {
    path: '',
    component: OpenRegistrationComponent,
  },
  {
    path: 'open-reg/:id',
    component: OpenRegistrationComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  }
];



@NgModule({
  declarations: [
    OpenRegistrationComponent,
    RegisterComponent,
    RegSingleComponent,
    RegTeamsComponent,
    RegDoublesComponent,
    RegMixDoublesComponent
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    DividerModule,
    AvatarModule,
    CheckboxModule,
    TableModule,
    CalendarModule,
    NgxPaginationModule,
    GifLoaderComponent,
    TranslateModule,
    ToastModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RegistrationModule { }
