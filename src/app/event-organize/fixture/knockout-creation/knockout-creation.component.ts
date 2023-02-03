import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'stupa-knockout-creation',
  templateUrl: './knockout-creation.component.html',
  styleUrls: ['./knockout-creation.component.scss'],
  providers: [MessageService,ConfirmationDialogService],
})
export class KnockoutCreationComponent {
  _showLoader: boolean = false;
  _currentEventId: any = '';
  _activeIndex = 0;
  _showFull: boolean = false;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() totalPlayer: any;
  _fixtureScreen: boolean = false;
  @Output() _schedule = new EventEmitter<{ schedule: boolean }>();
  @Output() isMatchesCreated = new EventEmitter<any>();
  _groupPlayOffSteps: any = [
    {
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
    },
  ];
  _eventId: any;
  _arrangePlayer: any = [];
  match_details: any = [];
  _data: any = [];
  _finalData: any = [];
  _participantID: any = [];
  _matchDetailsList: any = [];
  _showTooltip: any = false;
  _showCustomizedFixture: boolean=false;
  showSchedule: boolean = false;
  _showTree: boolean=false;
  _topPlayers: any =[];
  _topPlayersCopy: any =[];
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }
  
    
  
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this._currentCategoryId;
    this._currentParticipantId;
    this.fixtureService.players
    this.getFirstRoundKnockout();
    this.getPlayerList();
    // this._fixtureScreen = false;
    // this._showTree = false
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this._currentCategoryId;
    this._currentParticipantId;
    this.totalPlayer
    this.getFirstRoundKnockout();
    this.getPlayerList();
    // this._fixtureScreen = false;
    // this._fixtureScreen = false;
    // this._showTree = false;
  }
  getActive(data: any) { }
  generateFixtures() {
    //this._currentEventId = localStorage.getItem('event_data');
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      participant_type_id: this._currentParticipantId,
      max_winners: 1,
      main_draw_participants: [],
      min_no_participant: 1,
    };
    this.eventsService.generateFixtures(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        // this._showTree = false;
        // this._fixtureScreen = false;
        this.getFirstRoundKnockout();
        ///this._winnerCount = '';
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

  saveGroup() {
    this.showSchedule = true;
    this._schedule.emit({ schedule: this.showSchedule });
  }
  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        console.log(result);
        // this._fixtureScreen = true;
        // this._showTree = true;
        
        // this.messageService.add({
        //   key: 'bc',
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: result.body.msg,
        //   life: 3000,
        // });
        this.saveGroup();
        // this._showTree =true;
        // this._fixtureScreen = true;
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
  getFirstRoundKnockout() {
    this._matchDetailsList = [];
    this.fixtureService
      .generateFirstRoundKnockout(this._eventId, this._currentCategoryId)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          console.log(result);
          //this._showTree = false;
          //this._fixtureScreen = false
          this._arrangePlayer = result.body;
          this._matchDetailsList = result.body;
          this._arrangePlayer = this._arrangePlayer
            .map((md: any) => md.match_details)
            .flat();
          this.getKnockoutTournament(this._eventId, this._currentCategoryId);
          if (this._matchDetailsList.length > 0) {
            this.isMatchesCreated.emit(true);
          } else {
            this.isMatchesCreated.emit(false);
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
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: result.error.msg,
          //   life: 3000,
          // });
        },
        complete: () => { },
      });
  }
  justSaveKnockout() {
    this.eventsService
      .createMatches(this._eventId, this._currentCategoryId, 2)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          // window.location.reload()
          this._schedule.emit({ schedule: true });
          // this._fixtureScreen = true;
          // this._showTree = true;
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
  returnUpdatedList(data: any) {
    this._arrangePlayer = data;
    this._showCustomizedFixture = true;
  }
  saveCustomizedFixture() {
    this._participantID = this._arrangePlayer.map(
      (id: any) => id.participant_id
    );
    let matchesArray = [];
    //console.log(this._arrangePlayer)
    for (let i = 0; i < this._participantID.length; i += 2) {
      const matches = {
        participant_id_A: this._participantID[i],
        participant_id_B: this._participantID[i + 1],
      };
      matchesArray.push(matches);
    }

    const data = {
      event_id: parseInt(this._eventId),
      category_id: this._currentCategoryId,
      round: matchesArray.length * 2,
      matches: matchesArray,
    };
    this.fixtureService.generateCustomizedKnockout(data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        // this._fixtureScreen = true;
        // this._showTree = true;
        // window.location.reload()
        this._schedule.emit({ schedule: true });
        this.getKnockoutTournament(this._eventId, this._currentCategoryId);
        
        // this._showTree = true;
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
  removePlayer(id: any,index:any) {
    this.match_details.push(id)
    this._arrangePlayer.splice(index, 1);
    //this.deletedCategoryId.push(item.category_id);
    
  }
  showInfo(info: boolean) {
    this._showTooltip = info;
  }
  deleteFixture(){
    this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure ,you want to delete this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
        )
        .then((confirmed) => {
          if (confirmed) {
  
            this._showLoader = true;
            this.fixtureService.deleteKnockout(this._eventId,this._currentCategoryId).subscribe({
              next: (result: any) => {
                this._showLoader = false;
                this._arrangePlayer.length = 0;
                this._showTree = false;
                this._fixtureScreen = false;
                //this._showValues = false;
               
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
}
