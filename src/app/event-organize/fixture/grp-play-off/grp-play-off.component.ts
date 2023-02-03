import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-grp-play-off',
  templateUrl: './grp-play-off.component.html',
  styleUrls: ['./grp-play-off.component.scss'],
  providers: [MessageService],
})
export class GrpPlayOffComponent {
  _activeIndex = 0;
  _schedule: boolean = true;
  _openSchedule: boolean = false;
  _category: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Group Creation',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    }
  ];
  @Input() totalPlayer: any;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _showLoader: boolean = false;
  _fixtureScreen: boolean = false;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _isMatchesCreated: boolean = false;
  _isMatchesCompleted: boolean = false;
  isRefreshData: boolean = false;
  constructor(private eventsService: EventsService, private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService, private fixtureService: FixtureServiceService) {
    this._category = [
      {
        name: 'Men’s',
        totalPlayers: 12,
        playerInMainDraw: [
          {
            name: 'sadak',
            state: 'Punjab',
            points: '123',
            email: 'sadak@yopmail.com',
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
  }
  _eventId: any;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getFirstRoundKnockout();
    this.getGroupMatchDetails(this._currentCategoryId);

  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getFirstRoundKnockout();
  }
  getActive(data: any) {
  }
  tabSelection(data: any) {
    this._category[data.index];
  }
  openDialog() {
    this._openSchedule = true;
  }
  openSchedule(eventData: { schedule: boolean }) {
    this._schedule = eventData.schedule;
  }
  isMatchesCreated(data: any) {
    this._isMatchesCreated = data;
  }
  // get_group_matches_details
  getGroupMatchDetails(categoryId: any) {
    this._matchDetailsList = [];
    this._matchDetailsListCopy = [];
    this._showLoader = false;
    this.eventsService.getGroupMatchDetailsV2(this._eventId, categoryId, 1)
      .subscribe({
        next: (result: any) => {
          this.isRefreshData = false;
          this._showLoader = false;
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: result.body.msg,
          //   life: 3000,
          // });
          // this._matchDetailsList = result.body;
          this._matchDetailsList = [];
          this._matchDetailsListCopy = [];
          // this._matchDetailsList = result.body;

          // for (let i = 0; i < result.body.length; i++) {
          //   for (let j = 0; j < result.body[i].matches.length; j++) {
          //     const data = {
          //       "round_name": 'R' + result.body[i].matches[j].round,
          //       "group_id": result.body[i].matches[j].group_id,
          //       "match_id": result.body[i].matches[j].match_id,
          //       "category_id": result.body[i].category_id,
          //       "group_name": 'G' + (i + 1),
          //       "participantA_id": result.body[i].matches[j].match_details[0].participant_id,
          //       "participantB_id": result.body[i].matches[j].match_details[1].participant_id,
          //       "participantA_name": result.body[i].matches[j].match_details[0].participant_name,
          //       "participantB_name": result.body[i].matches[j].match_details[1].participant_name,
          //       "isSelected": false,
          //       "event_id": result.body[i].event_id,
          //     }
          //     this._matchDetailsList.push(data)
          //   }
          // }
          if (result.body.length > 0) {
            for (let j = 0; j < result.body.length; j++) {
              const data = {
                "round_name": 'R' + result.body[j].round,
                "group_id": result.body[j].group_id,
                "match_id": result.body[j].match_id,
                "category_id": result.body[j].category_id,
                "group_name": result.body[j].group_name,
                "participantA_id": result.body[j].match_details[0].participant_id,
                "participantB_id": result.body[j].match_details[1].participant_id,
                "participantA_name": result.body[j].match_details[0].participant_name,
                "participantB_name": result.body[j].match_details[1].participant_name,
                "isSelected": false,
                "event_id": result.body[j].event_id,
              }
              this._matchDetailsList.push(data)
              this._matchDetailsListCopy.push(data)
            }
          }


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
  getListWithCategoryId(categoryId: any) {
    this.getGroupMatchDetails(categoryId);
  }
  getFirstRoundKnockout() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.fixtureService.generateFirstRoundKnockout(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {

          this._showLoader = false;
          if (result.body.length > 0) {
            this.isLockedGroup();
            this._groupPlayOffSteps = [{
              label: 'Group Creation',
              command: (event: any) => {
                this._activeIndex = 0;
              },
            },
            {
              label: 'Main Draw',
              command: (event: any) => {
                this._activeIndex = 1;
              },
            },]
          } else {
            this._activeIndex = 0
            this._groupPlayOffSteps = [{
              label: 'Group Creation',
              command: (event: any) => {
                this._activeIndex = 0;
              },
            }]
            this._fixtureScreen = false;
          }

        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => { },
      });
    }

  }
  isLockedGroup() {
    this._showLoader = true;
    this.eventsService
      .getGroupList(this._eventId, this._currentCategoryId, 2)
      .subscribe({
        next: (result: any) => {

          this._fixtureScreen = result.body[0].locked

        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => { },
      });
  }
  refreshAllData() {
    this.isRefreshData = true;
    this.getFirstRoundKnockout();
    this.getGroupMatchDetails(this._currentCategoryId);
  }
}
