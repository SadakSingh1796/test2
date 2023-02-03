import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastOnlyComponent } from './broadcast-only/broadcast-only.component';
import { BroadcastDialogComponent } from './broadcast-dialog/broadcast-dialog.component';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { RouterModule, Routes } from '@angular/router';
import { BroadcastLayoutComponent } from './broadcast-layout/broadcast-layout.component';
const routes: Routes = [
  {
    path: '', component: BroadcastOnlyComponent,
    // canActivate: [AuthService]
  },
  {
    path: 'broadcast-only',
    component: BroadcastOnlyComponent,
    // canActivate: [AuthService],
  }
];
@NgModule({
  declarations: [BroadcastOnlyComponent, BroadcastDialogComponent, BroadcastLayoutComponent],
  imports: [CommonModule, CommonSvgMsgComponent, RouterModule.forChild(routes),],
})
export class BroadcastOnlyModule { }
