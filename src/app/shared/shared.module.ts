import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { RequestsComponent } from './requests/requests.component';
import { UserDetailsComponent } from './requests/user-details/user-details.component';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RegisteredComponent } from './order-history/registered/registered.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AvatarModule } from 'primeng/avatar';


@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    RequestsComponent,
    UserDetailsComponent,
    RegisteredComponent,
    OrderHistoryComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    CommonModule,
    DialogModule,
    //RouterModule.forChild(routes),
    ToastModule,
    RippleModule,
    TableModule,
    InputTextareaModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    PaginatorModule,
    OverlayPanelModule,
    AvatarModule
    // AdminModule
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [ConfirmationDialogService],
  exports: [RequestsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
