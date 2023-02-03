import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-import-member-dialog',
  templateUrl: './import-member-dialog.component.html',
  styleUrls: ['./import-member-dialog.component.scss'],
  providers: [MessageService],
})
export class ImportMemberDialogComponent implements OnInit, OnChanges {
  _officialList: any = [];
  @Input() _importOfficialList: any = [];
  @Input() _importOfficialListCopy: any = [];
  _showLoader: boolean = false;
  @Output() getOfficial = new EventEmitter<any>();
  _eventId: any = 0;
  _officialListCopy: any = [];
  _searchTeams: any = '';
  constructor(private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService,private messageService: MessageService) {
    // this.getOfficialList();
  }
  ngOnChanges(changes: SimpleChanges) {
    // this.getOfficialList();
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  getOfficialList() {
    this.eventsService.getOfficialList(this._eventId).subscribe({
      next: (result: any) => {
        this._officialList = result.body;
        this._officialListCopy = result.body;
      },
      error: (result) => { },
      complete: () => { },
    })

  }
  addEventOfficial(details: any) {
    const data = {
      "official_user_ids": [details.user_id]
    }
    this.eventsService.addEventOfficial(this._eventId, data).subscribe({
      next: (result: any) => {
        this._officialList = result.body;
        // this.getOfficialList();
        this.getOfficial.emit();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Imported',
          detail: result.body.msg,
          life: 1000,
        });

      },
      error: (result) => { },
      complete: () => { },
    })
  }
  findTeams() {
    this._importOfficialList = this._importOfficialListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase())
      );
    });
  }
}
