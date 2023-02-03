import { Component, OnInit } from '@angular/core';
import { RequestServiceService } from '../../services/AdminRequestService/request-service.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class RequestsComponent implements OnInit {
  cols: any = [];
  showDialog: boolean = false;
  showRejectionDialog: boolean = false;
  innerWidth: any;
  _getPendingUserList: any = [];
  _getAcceptedUserList: any = [];
  _getRejectedUserList: any = [];
  _fieldData: any = [];
  _currentType: any = [];
  _pending: any = '';
  _accepted: any = '';
  _rejected: any = '';
  _isSearching: boolean = true;
  _totalPendingUser: any = "";
  _totalAcceptedUser: any = "";
  _totalRejectedUser: any = "";
  _currenPendingPage: number = 1;
  _currenAcceptedPage: number = 1;
  _currenRejectedPage: number = 1;
  _rejectionMsg: any = '';
  _currentRoleId: any;
  _currentUserId: any;
  _showLoader: boolean = false;
  constructor(
    private requestService: RequestServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.innerWidth = window.innerWidth;
  }
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this.getPendingRequests();
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'country', header: 'Country' },
      { field: 'role', header: 'Roles' },
      { field: 'detail', header: 'Detail' },
      { field: 'Action', header: 'Action' },
    ];
  }
  openDialog(data: any) {
    this._fieldData = data;
    this.showDialog = true;
  }
  closePopUp() {
    this.showDialog = false;
  }
  getPendingRequests() {
    this._showLoader = true;
    this._getPendingUserList = [];
    const user_Id = 4;
    this.requestService.getRequests(user_Id, 'pending', this._currenPendingPage).subscribe({
      next: (data: any) => {
        this._getPendingUserList = [];
        this._showLoader = false;
        this._totalPendingUser = data.body[0];
        this._getPendingUserList = data.body[1];
        this._isSearching = false;
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {
        this._showLoader = false;
      },
    });
  }
  getAcceptedRequests() {
    this._showLoader = true;
    const user_Id = 4;
    this._getAcceptedUserList = [];
    this.requestService.getRequests(user_Id, 'accepted', this._currenAcceptedPage).subscribe({
      next: (data: any) => {
        this._getAcceptedUserList = [];
        this._showLoader = false;
        this._totalAcceptedUser = data.body[0];
        this._getAcceptedUserList = data.body[1];
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getRejectedRequests() {
    this._showLoader = true;
    const user_Id = 4;
    this._getRejectedUserList = [];
    this.requestService.getRequests(user_Id, 'rejected', 1).subscribe({
      next: (data: any) => {
        this._getRejectedUserList = [];
        this._showLoader = false;
        this._totalRejectedUser = data.body[0];
        this._getRejectedUserList = data.body[1];
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getRequestsWithSearch(type: any, seachText: any) {
    this._currentType = type;
    this._showLoader = true;
    const user_Id = 4;
    this.requestService
      .getRequestsWithSearch(user_Id, type, 1, seachText)
      .subscribe({
        next: (data: any) => {
          this._isSearching = false;
          this._showLoader = false;
          if (this._currentType == 'pending') {
            this._getPendingUserList = data.body[1];
          } else if (this._currentType == 'accepted') {
            this._getAcceptedUserList = data.body[1];
          } else if (this._currentType == 'rejected') {
            this._getRejectedUserList = data.body[1];
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  //#region Accepting Request
  acceptRequest(detail: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure you want to accept this invitation?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          const data = {
            user_id: detail.user_id,
            role_id: detail.role_id,
            verified: true,
          };
          this.requestService
            .updateRequests(detail.user_id, detail.role_id, true)
            .subscribe({
              next: (result: any) => {
                this._showLoader = false;
                this.messageService.add({
                  key: 'bc',
                  severity: 'success',
                  summary: 'Success',
                  detail: result.body.msg,
                  life: 3000,
                });
                this.getPendingRequests();
              },
              error: (result: any) => {
                this._showLoader = false;
                this.messageService.add({
                  key: 'bc',
                  severity: 'error',
                  summary: 'Info',
                  detail: result.error.msg,
                  life: 3000,
                });
              },
              complete: () => { },
            });
        } else {
        }
      })
      .catch(() => { });
  }
  //#endregion Accept Request End
  currentTab(data: any) {
    if (data.index == 0) {
      this.getPendingRequests();
    } else if (data.index == 1) {
      this.getAcceptedRequests();
    } else if (data.index == 2) {
      this.getRejectedRequests();
    }
  }
  rejectRequest(data: any) {

    this._currentRoleId = data.role_id;
    this._currentUserId = data.user_id;

    this.showRejectionDialog = true;
  }
  closeRejectionPopUp() {
    this.showRejectionDialog = false;
  }
  sendRejectionMail() {
    this.showRejectionDialog = false;
  }
  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
  //     event.data.sort((data1:any, data2:any) => {
  //         let value1 = data1[event.field];
  //         let value2 = data2[event.field];
  //         let result = null;

  //         if (value1 == null && value2 != null)
  //             result = -1;
  //         else if (value1 != null && value2 == null)
  //             result = 1;
  //         else if (value1 == null && value2 == null)
  //             result = 0;
  //         else if (typeof value1 === 'string' && typeof value2 === 'string')
  //             result = value1.localeCompare(value2);
  //         else
  //             result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

  //         return (event.order * result);
  //     });
  // }
  goBack() {
    this.router.navigate(['/home']);
  }
  paginate(event: any, type: string) {
    if (type === 'pending') {
      this._currenPendingPage = event.page + 1;
      this.getPendingRequests();
    }
    if (type === 'accepted') {
      this._currenAcceptedPage = event.page + 1;
      this.getAcceptedRequests();
    }
    if (type === 'rejected') {
      this._currenRejectedPage = event.page + 1;
      this.getRejectedRequests();
    }
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }
  rejectRequestByMessage() {

    this._showLoader = true;
    this.requestService
      .rejectWithMessage(this._currentUserId, this._currentRoleId, false, this._rejectionMsg)
      .subscribe({
        next: (data: any) => {
          this._rejectionMsg = '';
          this._showLoader = false;
          this.getPendingRequests();
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: data.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
}
