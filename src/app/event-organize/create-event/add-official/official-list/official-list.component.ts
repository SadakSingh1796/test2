import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-official-list',
  templateUrl: './official-list.component.html',
  styleUrls: ['./official-list.component.scss'],
  providers: [MessageService],
})
export class OfficialListComponent implements OnInit {
  _showDialog: boolean = false
  _officialArray = [
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Cash',
      verification: 'Not Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Unpaid',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Online',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Unpaid',
      verification: 'Verified',
    },
    {
      name: 'Divyanshu',
      role: 'Umpire',
      state: 'Delhi',
      email: 'xyz@yopmail.com',
      payment: 'Cash',
      verification: 'Verified',
    },
  ];
  _showOfficial: boolean = false
  _officialList: any = [];
  _officialListCopy: any = [];
  _officialRecentDeletedList: any = [];
  _officialRecentDeletedListCopy: any = [];
  _importOfficialList: any = [];
  _importOfficialListCopy: any = [];
  _showLoader: boolean = false;
  _searchByPlayerNameD: any = '';
  _searchByPlayerName: any = '';
  _eventId:any = 0;
  constructor(private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getEventOfficial(true);
    this.getEventRecentOfficial(false);
   }
  openAddOfficial() {
    this._showOfficial = true
  }
  landPage(data: any) {
    this._showOfficial = data;
  }
  getEventOfficial(state: any) {
    if(this._eventId != undefined || this._eventId !=null){
    this._showLoader = true;
    this.eventsService.getEventOfficial(this._eventId, state).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._officialList = [];
        this._officialListCopy = [];
        this._officialList = result.body;
        this._officialListCopy = result.body;
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },
    })
  }
  }
  getEventRecentOfficial(state: any) {
    if(this._eventId != undefined){
    this._showLoader = true;
    this.eventsService.getEventOfficial(this._eventId, state).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._officialRecentDeletedList = [];
        this._officialRecentDeletedListCopy = [];
        this._officialRecentDeletedList = result.body;
        this._officialRecentDeletedListCopy = result.body;
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },
    })
  }
  }
  tabSelection(data: any) {
    this._searchByPlayerNameD = '';
    this._searchByPlayerName = '';
    if (data.index == 0) {
      this.getEventOfficial(true);
    } else {
      this.getEventRecentOfficial(false);
    }
  }
  removeOfficial(details: any) {
    this._showLoader = true;
    const data = {
      "official_user_ids": [
        details.user_id
      ]
    }
    this.eventsService.removeOfficial(this._eventId, data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getEventOfficial(true);
        this.getEventRecentOfficial(false);
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },
    })
  }
  addEventOfficial(details: any) {
    const data = {
      "official_user_ids": [
        details.user_id
      ]
    }
    this._showLoader = true;
    this.eventsService.addEventOfficial(this._eventId, data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this._officialList = [];
        this._officialList = [];
        this._officialListCopy = result.body;
        this._officialList = result.body;
        this.getEventOfficial(false)
        this.getEventRecentOfficial(false);
      },
      error: (result) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Something went wrong.',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }
  importMembers() {
    this._showLoader = true;
    this.eventsService.getOfficialList(this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._importOfficialList = [];
        this._importOfficialList = result.body;
        this._importOfficialListCopy = result.body;
        this._showDialog = true;
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },
    })
  }
  searchPlayer() {
    this._officialList = this._officialListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.trim().toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.trim().toLowerCase())
      );
    });
  }
  searchRecentDelatedPlayer() {
    this._officialRecentDeletedList = this._officialRecentDeletedListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerNameD.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerNameD.toLowerCase())
      );
    });
  }
  Close() {
    this.getEventOfficial(true);
    this.getEventRecentOfficial(false);
  }
}
