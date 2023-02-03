import { Component, OnChanges, OnInit } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';


@Component({
  selector: 'stupa-viewer-fixtures',
  templateUrl: './viewer-fixtures.component.html',
  styleUrls: ['./viewer-fixtures.component.scss'],
})
export class ViewerFixturesComponent implements OnInit, OnChanges {
  _eventId: any;
  _participantTypesList: any = []
  _selectedParticipantTypes: any
  _currentParticipantId: any
  _categoryList: any = []
  _currentCategoryId: any
  _categoryName: any
  _showFixtureFormat: boolean = false
  _selectedFixtureFormat: any
  _fixtureFormat: any = []
  _category: any = [];
  _totalPlayer: any;
  _tabIndex: any;
  _isAPICompleted: boolean = false
  _set: any
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
  }
  ngOnChanges() {
    //this.getParticipantTypeAndCategories()
  }
  getParticipantTypeAndCategories() {
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
  tabSelection(data: any) {
    // this._category[data.index]
    this._categoryList[data.value];
    this._currentCategoryId = data.value.category_id;
    this._categoryName = data.value.category_description
    //this._totalPlayer = this._category[data.index].totalPlayers;
    // this._tabIndex = data.index;
    // localStorage.setItem('tabIndex', data.index)
    if (data.value.format_description != null) {
      this._showFixtureFormat = true;
      if (data.value.format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin'
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
        // this._fixtureFormat.push(
        //   { name: 'Round-Robin', key: 'RR' },
        // )
      } else if (data.value.format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout'
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
        // this._fixtureFormat.push(
        //   { name: 'Knockout', key: 'K' },
        // )
      } else if (data.value.format_description == 'play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff'
        this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
      }
    }
    else {
      this._showFixtureFormat = false;
    }
  }
  setType(data: any) {
    this._categoryList = data.value.categories

  }
}
