import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
  providers: [MessageService],
})

export class RankingsComponent implements OnInit {
  event_id: any;
  _participantType: any;
  _playerrank: any = [];
  _playerrankCopy: any = [];
  _activeIndex = 0;
  _category: any = [];
  _participantTypes: any[] = [
    { name: 'Single', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Doubles', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
    { name: 'Knockout', key: 'K' },
    { name: 'Round-Robin', key: 'RR' },
    { name: 'Group-PlayOff', key: 'GPO' },
  ];
  _selectedFixtureFormat: any = null;
  _categoryList: any = [];
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _currentEventId: any;
  _isAPICompleted: boolean = false;
  _tabIndex: any;
  _showLoader: boolean = false;
  _searchByPlayerName: any = '';
  constructor(private encyptDecryptService: EncyptDecryptService,
    private router: Router,
    private messageService: MessageService,
    private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantTypeAndCategories();
  }
  tabSelection(data: any) {
    this._searchByPlayerName = '';
    this._category[data.index]
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._tabIndex = data.index;
    if (this._categoryList[data.index].format_description == 'round robin') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Round-Robin'
      this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
    } else if (this._categoryList[data.index].format_description == 'knockout') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Knockout'
      this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
    } else if (this._categoryList[data.index].format_description == 'play off') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Group-PlayOff'
      this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
    }
    this.getCategoryRanking();
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  creatRanking() {
    this._showLoader = true;
    this.eventsService.createRanking(this.event_id, this._currentCategoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getCategoryRanking();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getCategoryRanking() {
    this._showLoader = true;
    this.eventsService.getCategoryRanking(this.event_id, this._currentCategoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._playerrank = [];
        this._playerrankCopy = [];
        this._playerrank = result.body
        this._playerrankCopy = result.body
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  getParticipantTypeAndCategories() {
    this._showLoader = true;
    this.eventsService.getParticipantTypeAndCategories(this.event_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = this._participantTypesList[0];
        this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
        this._categoryList = this._participantTypesList[0].categories;
        this._currentCategoryId = this._categoryList[0].category_id;
        this._isAPICompleted = true;
        this.getCategoryRanking();
        this.setFormat()
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  setFormat() {

    if (this._categoryList[0].format_description == 'round robin') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Round-Robin'
      this._fixtureFormat.push(
        { name: 'Round-Robin', key: 'RR' },
      )
    } else if (this._categoryList[0].format_description == 'knockout') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Knockout'
      this._fixtureFormat.push(
        { name: 'Knockout', key: 'K' },
      )
    } else if (this._categoryList[0].format_description == 'play off') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Group-PlayOff'
      this._fixtureFormat.push(
        { name: 'Group-PlayOff', key: 'GPO' }
      )
    }

  }
  currentParticipant(data: any) {
    this._searchByPlayerName = '';
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.getCategoryRanking()
    this.setFormat()
  }
  searchPlayer() {
    this._playerrank = this._playerrankCopy.filter((item: any) => {
      return (
        item.participant_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
}
