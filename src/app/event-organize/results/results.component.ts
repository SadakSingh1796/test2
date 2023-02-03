import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {

  _participantType: any;
  _activeIndex = 0;
  _category: any = [];
  _totalPlayer: any;
  _participantTypesList: any = [];
  _currentCategoryId: any;
  _currentParticipantId: any = '';
  _currentEventId: any;
  _categoryList: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Group Creation',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Match Scheduler',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 2;
      },
    },
  ];
  _participantTypes: any[] = [
    { name: 'Single', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Doubles', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];
    _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
  ];
  _selectedFixtureFormat: any = null;
  
  event: any;
  _eventId: any;
  constructor(
    private encyptDecryptService: EncyptDecryptService,
    public router: Router ,private eventsService: EventsService,
  ) {
   
    // this._selectedParticipantTypes = this._participantTypes[0];
    // this._selectedFixtureFormat = this._fixtureFormat[2];
    this._category = [
      {
        name: 'Men’s',
        totalPlayers: 12,
      },
      {
        name: 'Women’s',
        totalPlayers: 10,
      },
      { name: 'U-19 Boys', totalPlayers: 15 },
      { name: 'U-19 Girls', totalPlayers: 5 },
    ];
  }

  jump() {
    // <app-results></app-results>
    alert('clicked');
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
  }

  getActive(data: any) {}
  tabSelection(data: any) {
    this._category[data.index]
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._totalPlayer = this._category[data.index].totalPlayers
    if (this._categoryList[data.index].format_description == 'round robin') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Round-Robin'
      this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
      // this._fixtureFormat.push(
      //   { name: 'Round-Robin', key: 'RR' },
      // )
    } else if (this._categoryList[data.index].format_description == 'knockout') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Knockout'
      this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
      // this._fixtureFormat.push(
      //   { name: 'Knockout', key: 'K' },
      // )
    } else if (this._categoryList[data.index].format_description == 'play off') {
      this._fixtureFormat = [];
      this._selectedFixtureFormat = 'Group-PlayOff'
      this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
    }
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  
  currentParticipant(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat();
  }
 
  getParticipantTypeAndCategories() {
    this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
      next: (result: any) => {
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = this._participantTypesList[0];
        this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
        this._categoryList = this._participantTypesList[0].categories;
        this._currentCategoryId = this._categoryList[0].category_id;
        this.setFormat()
      },
      error: (result: any) => { },
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
  
}
