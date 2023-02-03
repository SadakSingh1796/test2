import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-knockout',
  templateUrl: './knockout.component.html',
  styleUrls: ['./knockout.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class KnockoutComponent {
  _showLoader: boolean = false;
  _currentEventId: any = '';
  _activeIndex = 0;
  _schedule: boolean = true;
  _showFull: boolean = false;
  _openSchedule: boolean = false;
  _isMatchesCreated: boolean = false;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() totalPlayer: any;
  _category: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Knockout Round',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    },
  ];
  _matchDetailsList: any;
  _matchDetailsListCopy: any;
  _fixtureScreen: boolean = false;
  _showValues: boolean = false;
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _isViewPlayerGrid: boolean = false;
  _dialogStyle = { width: '95vw' };
  _searchByPlayerNameView: any = '';
  constructor(
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService,
    private eventsService: EventsService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }
  _eventId: any = 0;
  ngOnInit(): void {
    this._currentCategoryId;
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.isLockedGroup();
    this.getPlayerList()
    //this.getKnockoutTournament(this._eventId, this._currentCategoryId)



  }
  getActive(data: any) {
  }
  tabSelection(data: any) {
    this._category[data.index];
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    //this.getKnockoutTournament(this._eventId, this._currentCategoryId)
    this._currentCategoryId;
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this._showValues = false
    this.isLockedGroup();
    this.getPlayerList()

    //this.getKnockoutTournament(this._eventId, this._currentCategoryId)

  }
  getFirstRoundKnockout(categoryId: any) {
    this.fixtureService.generateFirstRoundKnockout(this._eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        console.log(result);
        this._matchDetailsList = [];
        this._matchDetailsListCopy = [];
        for (let j = 0; j < result.body.length; j++) {
          const data = {
            "round_name": 'R' + result.body[j].round,
            "group_id": result.body[j].group_id,
            "match_id": result.body[j].match_id,
            "category_id": result.body[j].category_id,
            "group_name": 'G' + (j + 1),
            "participantA_id": result.body[j].match_details[0].participant_id,
            "participantB_id": result.body[j].match_details[1].participant_id,
            "participantA_name": result.body[j].match_details[0].participant_name,
            "participantB_name": result.body[j].match_details[1].participant_name,
            "isSelected": false,
            "event_id": this._eventId,
          }
          this._matchDetailsList.push(data);
          this._matchDetailsListCopy.push(data);
        }

        // this.messageService.add({
        //   key: 'bc',
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: result.body.msg,
        //   life: 3000,
        // });
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
  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        console.log(result)
        this.isLockedGroup();
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
  isLockedGroup() {
    this._showLoader = true;
    this.eventsService
      .getGroupList(this._eventId, this._currentCategoryId, 2)
      .subscribe({
        next: (result: any) => {

          this._fixtureScreen = result.body[0].locked;
          if (this._fixtureScreen) {
            this._showValues = true;
            this.getKnockoutTournament(this._eventId, this._currentCategoryId)
            this._activeIndex = 1;

          }
          else {
            //this._fixtureScreen=false;
            this._activeIndex = 0;
            this._fixtureScreen = false;
            this._showValues = false;
            //this.getKnockoutTournament(this._eventId, this._currentCategoryId)
          }

        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => { },
      });
  }
  openDialog() {
    this._openSchedule = true;
  }
  openSchedule(eventData: { schedule: boolean }) {

    this._schedule = eventData.schedule;
    this.isLockedGroup();
    this.getPlayerList()
  }
  getListWithCategoryId(categoryId: any) {
    this.getFirstRoundKnockout(categoryId);
  }
  isMatchesCreated(data: any) {

    this._isMatchesCreated = data;
  }


  deleteFixture() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader = true;
          this.fixtureService.deleteKnockout(this._eventId, this._currentCategoryId).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this._showValues = false;

            },
            error: (result: any) => {
              this._showLoader = false;
            },
            complete: () => {
            },
          });
        } else {
        }
      })
      .catch(() => { });

  }
  getPlayerList() {
    this._showLoader = true;
    this._currentEventId = localStorage.getItem('event_data');
    this.eventsService
      .getEventRegistedPlayers(
        JSON.parse(this._currentEventId).event_id,
        this._currentParticipantId,
        this._currentCategoryId
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._topPlayers = [];
          this._topPlayersCopy = [];
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              user_id: result.body[i].event_participant_details[0].user_id,
              name: result.body[i].event_participant_details[0].name,
              email: result.body[i].event_participant_details[0].email,
              gender_id: result.body[i].event_participant_details[0].gender_id,
              isSelected: false,
              club: result.body[i].name,
              points: result.body[i].points == null ? 0 : result.body[i].points,
              state: result.body[i].event_participant_details[0].state,
              participant_id: result.body[i].event_participant_details[0].participant_id
            };
            this._topPlayers.push(data);
            this._topPlayersCopy.push(data);
            // this.getPlayersForMainDraw()
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this._topPlayers = [];
          this._topPlayersCopy = [];
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
  refreshAllData() {
    this._showValues = false;
    this.isLockedGroup();
    this.getPlayerList()
  }
  viewPlayer() {
    // if (this._matchDetailsList.length == 0) {
    //   this._isViewPlayerGrid = true;
    // }
    this._isViewPlayerGrid = true;
  }
  searchPlayerInView() {
    this._topPlayers = [];
    this._topPlayers = this._topPlayersCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerNameView.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerNameView.toLowerCase())
      );
    });
  }
}

