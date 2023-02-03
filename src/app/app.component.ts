import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mux-video';
  dataList: any = [
    { id: 'Sm1VDwh2dvXSZXesQP8sXWd9Xutyb7Q8SybEhqjlYnQ' },
    { id: '00o02PFE8Vf023Xj00L9UNyA00OqBWnp8AmLZmVSpRxijEws' },
    { id: 'S9mnAjMMAp3iT15Q01l02O2wMrXwEk02aKjLjNZW91hXRA' },
    { id: '00o02PFE8Vf023Xj00L9UNyA00OqBWnp8AmLZmVSpRxijEws' }
  ]
  PLAYBACK_ID: any = 'https://stream.mux.com/22eyC2mYPtcPjuCE1FK4cs5Xx01oTqncR3XXPWADegpI/high.mp4'
  playbackId: string = "00o02PFE8Vf023Xj00L9UNyA00OqBWnp8AmLZmVSpRxijEws"
  constructor() {

  }
}
