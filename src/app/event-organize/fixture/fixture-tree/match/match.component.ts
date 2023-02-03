import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stupa-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent {
  @Input() match: any;
  @Input() round: any;
  @Input() index: any;
  @Input() parentIndex: any;
  @Input() fillList: any;
  @Output('updatedPullList') updatedPullList = new EventEmitter<any>();
  messageService: any;
  _beforePanel: boolean = true;
  _showScorePanel: boolean = false
  _players: any = [
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
  ];
  _playersArray: any = [
    {
      name: 'Anshu Gulia', setScore: [
        { score: 11 },
        { score: 12 },
        { score: 11 },
        { score: 8 },
        { score: 7 },
        { score: 14 },
      ], score: 8,
      showVs: true
    },
    {
      name: 'Darshan Ahlawat', setScore: [
        { score: 11 },
        { score: 12 },
        { score: 11 },
        { score: 8 },
        { score: 7 },
        { score: 14 },
      ], score: 4,
      showVs: false
    },
  ]
  constructor() { }

  ngOnInit() {
    console.log(this.match.match_details);

  }
  returnUpdatedList(data: any) {
    this.match.match_details = data;
  }
  returnUpdatedPullList(data: any) {
    this.updatedPullList.emit(data);
  }
  getIndex(match_index: any) {
    if (this.round == 0) {
      return match_index + 1 + this.index + 1 * this.index;
    } else {
      return '';
    }
  }
  showSwaping(popup: any) {
    popup.toggle;
  }
  toShow() {
    this._beforePanel = false;
  }
  showScore(data: any) {
    this._showScorePanel = data
  }
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase()
    }
  }
}
