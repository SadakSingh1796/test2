import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss'],
})
export class FixtureComponent implements OnInit {
  _participantType: any;
  _activeIndex = 0;
  _category: any = [];
  _categoryList: any = [];

  _groupPlayOffSteps: any = [{
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
  }];
  _participantTypes: any[] = [
    { name: 'Single', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Doubles', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' }
  ];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
    // { name: 'Knockout', key: 'K' },
    // { name: 'Round-Robin', key: 'RR' },
    // { name: 'Group-PlayOff', key: 'GPO' }
  ];
  _selectedFixtureFormat: any;
  _totalPlayer: any;
  _eventId: any;
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _currentEventId: any;
  _isAPICompleted: boolean = false;
  _tabIndex: any = 0;
  _showFixtureFormat: boolean = false;
  _categoryName: any;
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private router: Router) {
    // this._selectedParticipantTypes = this._participantTypes[0];
    // this._selectedFixtureFormat = this._fixtureFormat[2];
    this._category = [
      {
        name: 'Men’s',
        totalPlayers: 12,
        playerInMainDraw: [
          {
            name: 'Anshu',
            state: 'Rio-De Jenerio',
            points: '203',
            email: 'xyz@yopmail.com',
          },
          {
            name: 'Anshu',
            state: 'Rio-De Jenerio',
            points: '203',
            email: 'xyz@yopmail.com',
          },
          {
            name: 'Anshu',
            state: 'Rio-De Jenerio',
            points: '203',
            email: 'xyz@yopmail.com',
          },
        ],
      },
      {
        name: 'Women’s',
        totalPlayers: 10,
        playerInMainDraw: [
          {
            name: 'Anshu',
            state: 'Rio-De Jenerio',
            points: '203',
            email: 'xyz@yopmail.com',
          },
        ],
      },
      { name: 'U-19 Boys', totalPlayers: 15, playerInMainDraw: [] },
      { name: 'U-19 Girls', totalPlayers: 5, playerInMainDraw: [] },
    ];
    // this.getParticipantTypeAndCategories();
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
  }

  getActive(data: any) {
  }
  tabSelection(data: any) {
    
    this._category[data.index]
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._categoryName = this._categoryList[data.index].category_description
    this._totalPlayer = this._category[data.index].totalPlayers;
    this._tabIndex = data.index;
    localStorage.setItem('tabIndex', data.index)
    if (this._categoryList[data.index].format_description != null) {
      this._showFixtureFormat = true;
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
    else {
      this._showFixtureFormat = false;
    }
  }
  getParticipantTypeAndCategories() {
    // this._currentEventId = localStorage.getItem('event_data')
    // this.eventsService.getParticipantTypeAndCategories(JSON.parse(this._currentEventId).event_id).subscribe({
    this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
      next: (result: any) => {
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = this._participantTypesList[0];
        this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
        this._categoryList = this._participantTypesList[0].categories;
        this._currentCategoryId = this._categoryList[0].category_id;
        this._categoryName = this._categoryList[0].category_description

        this._isAPICompleted = true;
        this.setFormat()
      },
      error: (result: any) => { },
      complete: () => { },
    });
  }
  currentParticipant(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat()
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  setFormat() {
    console.log(this._categoryList[0].format_description)
    if (this._categoryList[0].format_description != null) {
      this._showFixtureFormat = true;
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
    else {
      this._showFixtureFormat = false;
    }
  }
}
