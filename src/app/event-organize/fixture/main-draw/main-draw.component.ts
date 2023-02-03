import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { NgttTournament } from '../fixture-tree/interfaces';

@Component({
  selector: 'stupa-main-draw',
  templateUrl: './main-draw.component.html',
  styleUrls: ['./main-draw.component.scss'],
})
export class MainDrawComponent implements OnInit {
  public singleEliminationTournament!: NgttTournament;
  public doubleEliminationTournament!: NgttTournament;
  public renderedTree: 'se' | 'de' = 'de';
  _fixture: any = [];
  _topPlayers: any = [
    // {
    //   name: 'Sadak',
    //   state: 'Punjab',
    //   point: 234,
    //   email: 'sadak@yopmail.com',
    //   club: 'apnaPunjab',
    // },
    // {
    //   name: 'Sadak 2',
    //   state: 'Punjab',
    //   point: 2314,
    //   email: 'sadak@yopmail.com',
    //   club: 'apnaPunjab',
    // },
    // {
    //   name: 'Sadak 3',
    //   state: 'Punjab',
    //   point: 204,
    //   email: 'sadak@yopmail.com',
    //   club: 'apnaPunjab',
    // },
    // {
    //   name: 'Sadak 4',
    //   state: 'Punjab',
    //   point: 204,
    //   email: 'sadak@yopmail.com',
    //   club: 'apnaPunjab',
    // },
  ];
  _players: any = [
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
    { name: 'lorem ipsum dolor' },
  ];
  _arrangePlayer: any = [
    {
      name: 'Darshan',
      state: 'Haryana',
      club: 'Pinnacle',
      points: 25,
      email: 'abc@yopmail.com',
    },
    {
      club: 'Unified Titans',
      name: 'Divyanshu',
      state: 'Haryana',
      points: 23,
      email: 'abc@yopmail.com',
    },
    {
      club: 'table tennis foundation',
      name: 'Vaibhav',
      state: 'Delhi',
      points: 254,
      email: 'abc@yopmail.com',
    },
  ];
  @Input() _fixtureScreen: boolean = false;
  _controller: boolean = true;
  _showLoader: boolean = false;
  _matchDetailsList: any = [];
  _eventId: any;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _participantIdList: any = [];
  _mathesList: any = [];
  _fixtureTreeData: any = [];
  _showTree: boolean = false;
  _isAllAPIExcecuted: boolean = false;
  constructor(private fixtureService: FixtureServiceService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getFirstRoundKnockout();
    this.getKnockoutTournament();
    this.doubleEliminationTournament = {
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  B', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  B', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  F', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  C', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  G', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  B', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  D', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  B', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  D', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Player  H',
                  score: 1,
                },
                {
                  name: 'Player  F',
                  score: 2,
                },
              ],
            },
          ],
        },
      ],
    };
    this.singleEliminationTournament = {
      rounds: [
        {
          roundName: 'Round 16',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Bye', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Bye', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  I', score: 2 },
                { name: 'Player  J', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  K', score: 2 },
                { name: 'Player  L', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  M', score: 1 },
                { name: 'Player  N', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  O', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Quarter-Final',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player D', score: 0 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  I', score: 1 },
                { name: 'Player  K', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  N', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Semi-Final',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  K', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Final',
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Player  G',
                  score: 1,
                },
                {
                  name: 'Player  P',
                  score: 2,
                },
              ],
            },
            // {
            //   teams: [
            //     {
            //       name: 'Player  F',
            //       score: 1
            //     }
            //   ]
            // }
          ],
        },
      ],
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getFirstRoundKnockout();
    this.getKnockoutTournament();

  }
  updatedPullList(data: any) {
    this.singleEliminationTournament.rounds[0] = data;
  }
  showFixture() {
    this._fixtureScreen = true;
    this._controller = false;
  }
  getFirstRoundKnockout() {
    this._isAllAPIExcecuted = false
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this.fixtureService.generateFirstRoundKnockout(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {
          this._isAllAPIExcecuted = true
          this._showLoader = false;
          console.log(result);
          this._arrangePlayer = []
          this._matchDetailsList = result.body;
          this._arrangePlayer = result.body.map((md: any) => md.match_details).flat();
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
          this._isAllAPIExcecuted = true;
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
  returnUpdatedList(detailsAfterSwap: any) {
    this._arrangePlayer = detailsAfterSwap;
  }
  generateCustomeKO() {
    this._participantIdList = this._arrangePlayer.map((id: any) => id.participant_id);
    this._mathesList = [];
    for (let i = 0; i < this._participantIdList.length; i += 2) {
      const matches = {
        participant_id_A: this._participantIdList[i],
        participant_id_B: this._participantIdList[i + 1]
      }
      this._mathesList.push(matches)
    }
    const data = {
      event_id: parseInt(this._eventId),
      category_id: this._currentCategoryId,
      round: this._mathesList.length * 2,
      matches: this._mathesList
    }
    this.fixtureService.generateCustomizedKnockout(data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.getKnockoutTournament();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getKnockoutTournament() {
    this._isAllAPIExcecuted = false
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this.fixtureService.getKnockoutTournament(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {
          if (result.body.length > 0) {
            this._showTree = true;
            this.singleEliminationTournament.rounds = [];
            for (let i = 0; i < result.body.length; i++) {
              if (result.body[i].round == 'Final') {
                const dd = {
                  roundName: 'Final',
                  type: 'Final',
                  matches: result.body[i].matches

                }
                this.singleEliminationTournament.rounds.push(dd)
              } else {
                const dd = {
                  roundName: result.body[i].round,
                  type: 'Winnerbracket',
                  matches: result.body[i].matches
                }
                this.singleEliminationTournament.rounds.push(dd)
              }
            }
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          } else {
            // this._fixtureScreen = false; 
          }
          this._isAllAPIExcecuted = true;
          this._showTree = this._fixtureScreen
        },
        error: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
  saveAsBefore() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this.eventsService.createMatches(this._eventId, this._currentCategoryId, 2).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });

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

  }
}
