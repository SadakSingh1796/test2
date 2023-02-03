import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-round-robin',
  templateUrl: './round-robin.component.html',
  styleUrls: ['./round-robin.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class RoundRobinComponent {
  _selectedPlayerForMainDraw: any = [
    // {
    //   name: 'Divyanshu',
    //   state: 'Haryana',
    //   club: 'Pinnacle',
    //   points: 5,
    //   email: 'divyanshu@yopmail.com',
    // },
    // {
    //   name: 'Divyanshu',
    //   state: 'Haryana',
    //   club: 'Pinnacle',
    //   points: 5,
    //   email: 'divyanshu@yopmail.com',
    // },
    // {
    //   name: 'Divyanshu',
    //   state: 'Haryana',
    //   club: 'Pinnacle',
    //   points: 5,
    //   email: 'divyanshu@yopmail.com',
    // },
  ];
  _topPlayersList: any = [
    // {
    //   round: 'R1',
    //   playerAName: 'Sadak Sher Gill',
    //   playerBName: 'Anshu Gulia',
    //   score: '3-0',
    // },
    // {
    //   round: 'R1',
    //   playerAName: 'Sadak Sher Gill',
    //   playerBName: 'Anshu Gulia',
    //   score: '3-0',
    // },
    // {
    //   round: 'R1',
    //   playerAName: 'Sadak Sher Gill',
    //   playerBName: 'Anshu Gulia',
    //   score: '3-0',
    // },
    // {
    //   round: 'R1',
    //   playerAName: 'Sadak Sher Gill',
    //   playerBName: 'Anshu Gulia',
    //   score: '3-0',
    // },
  ];
  _playerDetail: any = [
    { name: 'Ritesh Kumar', state: 'Rio-De Jenerio', dummy: 'Dummy', points: 204 },
    { name: 'Ritesh Kumar', state: 'Rio-De Jenerio', dummy: 'Dummy', points: 204 },
    { name: 'Ritesh Kumar', state: 'Rio-De Jenerio', dummy: 'Dummy', points: 204 },
    { name: 'Ritesh Kumar', state: 'Rio-De Jenerio', dummy: 'Dummy', points: 204 },
  ]
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() totalPlayer: any;
  _eventId: any;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _showLoader: boolean = false;
  _groupList: any = [];
  _isLocked: boolean = false;
  _openSchedule: boolean = false;
  @Input() _fixtureFormat: any = [];
  @Input() _tabIndex: any;
  _finalGroupList: any = [];
  _participantContainer: any = [];
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _dialogStyle = { width: '95vw' };
  _isViewPlayerGrid: boolean = false;
  _searchByPlayerNameView: any = '';
  @Input() _categoryName: any
  constructor(private eventsService: EventsService, private confirmationDialogService: ConfirmationDialogService,
    private encyptDecryptService: EncyptDecryptService, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
  getGroupMatchDetails() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = []
      // this._showLoader = true;
      this.eventsService
        .getGroupMatchDetails(
          this._eventId,
          this._currentCategoryId,
          1
        )
        .subscribe({
          next: (result: any) => {
            this.getGroupMatchsForSchedule(this._currentCategoryId)
            this._topPlayersList = [];
            if (result.body.length > 0) {
              this._topPlayersList = result.body[0].matches;
            }

            // this.messageService.add({
            //   key: 'bc',
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: result.body.msg,
            //   life: 3000,
            // });
            this._showLoader = false;
          },
          error: (result: any) => {
            this._showLoader = false;
            // this.messageService.add({
            //   key: 'bc',
            //   severity: 'info',
            //   summary: 'Info',
            //   detail: result.error.msg,
            //   life: 3000,
            // });
          },
          complete: () => { },
        });
    }

  }
  createDraw() {
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      participant_type_id: this._currentParticipantId,
      max_winners: 1,
      main_draw_participants: [],
      min_no_participant: 1,
    };
    this._showLoader = false;
    this.eventsService.generateFixtures(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getGroupList();
      },
      error: (result: any) => {
        this._showLoader = false;
        // this.messageService.add({
        //   key: 'bc',
        //   severity: 'info',
        //   summary: 'Info',
        //   detail: result.error.msg,
        //   life: 3000,
        // });
      },
      complete: () => { },
    });
  }
  getGroupList() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      // this._showLoader = true;
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 1)
        .subscribe({
          next: (result: any) => {
            this._groupList = [];
            if (result.body.length > 0) {
              this._groupList = result.body[0].group_details;
              this._isLocked = result.body[0].locked
              this._showLoader = false;
            }
          },
          error: (result) => {
            this._showLoader = false;
          },
          complete: () => { },
        });
    }

  }
  returnUpdatedList(detailsAfterSwap: any) {
    this._groupList = detailsAfterSwap;
  }
  generateCustomeKO() {

  }
  deleteFixtures() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.eventsService.deleteFixtures(this._currentCategoryId, this._eventId).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });
              this._isLocked = false;
              this.getGroupList();
              this.getGroupMatchDetails();
            },
            error: (result: any) => {
              this._showLoader = false;
              // this.messageService.add({
              //   key: 'bc',
              //   severity: 'info',
              //   summary: 'Info',
              //   detail: result.error.msg,
              //   life: 3000,
              // });
            },
            complete: () => { },
          });

        } else {
        }
      })
      .catch(() => { });


  }
  createCustomGroup() {
    this._finalGroupList = [];
    this._participantContainer = [];
    for (let i = 0; i < this._groupList.length; i++) {

      // for (let j = 0; j < this._groupList[i].group_details.length; j++) {
      //   const data = {
      //     participant_id: this._groupList[i].group_details[j].participant_id,
      //     position: this._groupList[i].group_details[j].position,
      //   };
      //   this._participantContainer.push(data);
      // }
      const data = {
        participant_id: this._groupList[i].participant_id,
        position: this._groupList[i].position,
      };
      this._participantContainer.push(data);
      // const data1 = {
      //   participants: this._participantContainer,
      // };
      // this._finalGroupList.push(data1);
    }
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      max_winners: 1,
      locked: true,
      groups: [{
        "participants": this._participantContainer
      }],
    };
    this.eventsService.createCustomGroups(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
        this.createMatches();
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
  saveAsBefore() {
    this._showLoader = true;
    this.eventsService.lockGroup(this._eventId, this._currentCategoryId)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
          this.createMatches();
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
  createMatches() {
    this._showLoader = true;
    this.eventsService
      .createMatches(
        this._eventId,
        this._currentCategoryId,
        1
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          this.getGroupList();
          this.getGroupMatchDetails();
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
  openDialog() {
    this._openSchedule = true;
  }
  getGroupMatchsForSchedule(category_id: any) {
    this._matchDetailsList = [];
    this._matchDetailsListCopy = [];
    this._showLoader = true;
    this.eventsService.getGroupMatchDetailsV2(this._eventId, category_id, 1)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._matchDetailsList = [];
          this._matchDetailsListCopy = [];
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
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'info',
          //   summary: 'Info',
          //   detail: result.error.msg,
          //   life: 3000,
          // });
        },
        complete: () => { },
      });
  }
  getPlayerList() {
    this._showLoader = true;
    this.eventsService
      .getEventRegistedPlayers(
        this._eventId,
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
          this.totalPlayer = this._topPlayers.length;
        },
        error: (result: any) => {
          this._showLoader = false;
          this._topPlayers = [];
          this._topPlayersCopy = [];
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'info',
          //   summary: 'Info',
          //   detail: result.error.msg,
          //   life: 3000,
          // });
        },
        complete: () => { },
      });
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
  viewPlayer() {
    // if (this._matchDetailsList.length == 0) {
    //   this._isViewPlayerGrid = true;
    // }
    this._isViewPlayerGrid = true;
  }
  _isScoreUpadted(data: any) {

    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
  refreshAllData() {
    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
}
