import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-live-videos',
  templateUrl: './live-videos.component.html',
  styleUrls: ['./live-videos.component.scss']
})
export class LiveVideosComponent {
  @Output() tabIndex = new EventEmitter<number>();
  event_id: any;
  _liveMatchesList: any = [];
  _liveMatchesListCopy: any = [];
  _showLoader: boolean = false;
  @Input() _tabIndex: any
  _showVideoOnFullScreen: boolean = false;
  _currentPlayBackId: any;
  constructor(private encyptDecryptService: EncyptDecryptService, private router: Router, private videosService: VideosService) {
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getEventLiveMatches();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getEventLiveMatches();
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  getEventLiveMatches() {
    this._showLoader = true;
    this.videosService.getEventLiveMatches(this.event_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._liveMatchesList = [];
        for (let i = 0; i < result.body.length; i++) {
          const videosDetails = {
            "match_id": result.body[i].match_id,
            "round_description": result.body[i].round_description,
            "playback_id": result.body[i].playback_id,
            "asset_playback_id": result.body[i].asset_playback_id,
            "participants": result.body[i].participants,
            "thumbnail": 'https://image.mux.com/' + result.body[i].playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
          }
          this._liveMatchesList.push(videosDetails);
          this._liveMatchesListCopy.push(videosDetails);
        }
        // this._liveMatchesList = result.body;
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => { },
    });
  }
  viewVideo(item: any) {
    this._currentPlayBackId = item.playback_id;
    this._showVideoOnFullScreen = true
  }
}
