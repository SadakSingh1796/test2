import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-stream-matches',
  templateUrl: './stream-matches.component.html',
  styleUrls: ['./stream-matches.component.scss']
})
export class StreamMatchesComponent {
  _eventId: any;
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _showFixtureFormat: boolean = false;
  _selectedParticipantTypes: any = null;
  _categoryList: any = [];
  _fixtureFormat: any = [];
  _category: any = [];
  _totalPlayer: any;
  _streamedVideos: any = [];
  _showLoader: boolean = false;
  @Input() _tabIndex: any
  _streamedVideosCopy: any = [];
  _searchByPlayerName: any = '';
  _showVideoOnFullScreen: boolean = false;
  _currentAssetId: any
  constructor(private encyptDecryptService: EncyptDecryptService, private router: Router,
    private eventsService: EventsService, private videosService: VideosService) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantTypeAndCategories()
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getParticipantTypeAndCategories()
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  currentParticipant(data: any) {
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat()
  }
  getParticipantTypeAndCategories() {
    this._showLoader = true;
    this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = this._participantTypesList[0];
        this._categoryList = this._participantTypesList[0].categories;
        this._currentCategoryId = this._categoryList[0].category_id;
        this.setFormat();
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  tabSelection(data: any) {
    this._currentCategoryId = this._categoryList[data.index].category_id;
    if (this._categoryList[data.index].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[data.index].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
      } else if (this._categoryList[data.index].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
      } else if (this._categoryList[data.index].format_description == 'play off') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
      }
    }
    else {
      this._showFixtureFormat = false;
    }
    this.getEventLiveMatches();
  }
  setFormat() {
    if (this._categoryList[0].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[0].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Round-Robin', key: 'RR' },
        )
      } else if (this._categoryList[0].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Knockout', key: 'K' },
        )
      } else if (this._categoryList[0].format_description == 'play off') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Group-PlayOff', key: 'GPO' }
        )
      }
    }
    else {
      this._showFixtureFormat = false;
    }
    this.getEventLiveMatches()
  }
  getEventLiveMatches() {
    this._showLoader = true;
    this.videosService.getEventStreamedMatches(this._eventId, this._currentCategoryId, 'streamed').subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._streamedVideos = [];
        this._streamedVideosCopy = [];
        for (let i = 0; i < result.body.length; i++) {
          const videosDetails = {
            "match_id": result.body[i].match_id,
            "round_description": result.body[i].round_description,
            "playback_id": result.body[i].playback_id,
            "asset_playback_id": result.body[i].asset_playback_id,
            "participants": result.body[i].participants,
            "thumbnail": 'https://image.mux.com/' + result.body[i].asset_playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
          }
          this._streamedVideos.push(videosDetails);
          this._streamedVideosCopy.push(videosDetails);
        }

      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  searchPlayer() {
    this._streamedVideos = this._streamedVideosCopy.filter((item: any) => {
      return (
        item.participants[0]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participants[1]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  viewVideo(item: any) {
    this._currentAssetId = item.asset_playback_id;
    this._showVideoOnFullScreen = true
  }
}
