import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class GroupCreationComponent implements OnInit {
  //#region Variable Declaration Start
  _myexpand: boolean = false;
  _showFull: boolean = false;
  _fullScreenView: boolean = false;
  _showPlayers: boolean = true;
  _isFullViewGrid: boolean = false;
  _isAddPlayerGrid: boolean = false;
  showSchedule: boolean = false;
  _grpSwapPlayer: boolean = false;
  _showLoader: boolean = false;
  _isLocked: boolean = false;
  @Input() _category = [];
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _groupList: any = [];
  _winningPlayer = [
    { caption: 'Number of Winners 1', value: 1 },
    { caption: 'Number of Winners 2', value: 2 },
    { caption: 'Number of Winners 3', value: 3 },
  ];
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _topPlayersList: any = [];
  _dialogStyle = { width: '95vw' };
  _selectedPlayer: any = [];
  _winnerCount: any;
  _finalGroupList: any = [];
  _participantContainer: any = [];
  _matchDetailsList: any = [];
  _currentEventId: any = '';
  _searchByPlayerName: any = '';
  _searchByPlayerNameView: any = '';
  _mainDrawParticipantsList: any = [];
  _selectedPlayerForMainDraw: any = [];
  _playerListWithGroupName: any = [];
  _playerSwapDataList: any = [];
  _playerListWithGroupNameCopy: any = [];
  _currentGroupName: any = '';
  @Output() _schedule = new EventEmitter<{ schedule: boolean }>();
  @Output() isMatchesCreated = new EventEmitter<any>();
  _eventId: any;
  _isViewPlayerGrid: boolean = false;
  _searchByPlayerNameSwap: any = '';
  @Input() isRefreshData: boolean = false;
  _isGroupCreated: boolean = false;
  //#endregion Variable Declaration End
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.getGroupList();
    this.getMainDraw();
    this.getGroupMatchDetails();
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGroupList();
    this.getMainDraw();

    this.getPlayerList();
    this.getGroupMatchDetails();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.isRefreshData = false
    this.getGroupList();
    this.getPlayerList();
    this.getGroupMatchDetails();
  }
  openAccordion(index: any) {
    this._groupList[index].showButton = true;
  }
  showFullScreen() {

    this._groupList
    for (let i = 0; i < this._groupList.length; i++) {
      this._groupList[i].showButton = false
    }
    this._fullScreenView = true;
  }
  closeFullView() {
    this._groupList
    for (let i = 0; i < this._groupList.length; i++) {
      this._groupList[i].showButton = false
    }
    this._fullScreenView = false;
  }
  closeAccordion(index: any) {
    this._groupList[index].showButton = false;
    this._groupList[index].showDropDown = false;
  }
  deleteGroup($event: MouseEvent, index: any) {
    $event.stopPropagation();
    for (let i = 0; i < this._groupList[index].group_details.length; i++) {
      this._topPlayersList.push(this._groupList[index].group_details[i]);
    }
    this._groupList.splice(index, 1);
  }
  addDrp($event: MouseEvent, index: any) {
    $event.stopPropagation();
    this._groupList[index].showDropDown = true;
  }
  removeDrpDown($event: MouseEvent, index: any) {
    $event.stopPropagation();
    this._groupList[index].showDropDown = false;
  }
  selectedPlayer(data: any, index: any) {
    this._topPlayersList.splice(
      this._topPlayersList.findIndex(
        (x: any) => x.participant_name == data.value.participant_name
      ),
      1
    );
    this._groupList[index].group_details.push(data.value);
    this._selectedPlayer = [];
  }
  removePlayer(parentIndex: any, childIndex: any, itemDetail: any) {
    this._groupList[parentIndex].group_details[childIndex];
    this._groupList[parentIndex].group_details.splice(childIndex, 1);
    this._topPlayersList.push(itemDetail);
  }
  viewFullGridData() {
    if (this._selectedPlayerForMainDraw.length > 0) {
      this._isFullViewGrid = true;
    }
  }
  addPlayer() {
    if (this._matchDetailsList.length == 0 && this._topPlayers.length > 0) {
      this._isAddPlayerGrid = true;
    }
  }
  viewPlayer() {
    if ( this._topPlayers.length > 0) {
      this._isViewPlayerGrid = true;
    }
    // this._isViewPlayerGrid = true;
  }
  addGroup() {
    const data = {
      group_id: 0,
      group_type: 1,
      category_id: this._currentCategoryId,
      event_id: this._currentCategoryId,
      group_details: [],
      label: 'Group ' + (this._groupList.length + 1),
      showButton: false,
      showDropDown: false,
      data: 'Pictures Folder1',
      playerAdded: 3,
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: [],
    };
    this._groupList.push(data);
  }
  saveGroup() {
    this.showSchedule = true;
    this._schedule.emit({ schedule: this.showSchedule });
  }
  getGroupList() {
    this._showLoader = true;
    this._currentEventId = localStorage.getItem('event_data');
    const event_id = JSON.parse(this._currentEventId).event_id;
    const category_id = this._currentCategoryId;
    const group_type = 1;
    this.eventsService
      .getGroupList(event_id, category_id, group_type)
      .subscribe({
        next: (result: any) => {
          this._groupList = [];
          this._showLoader = false;
          this._isLocked = false;
          if (result.body.length > 0) {
            this._isGroupCreated = true;
            this._isLocked = result.body[0].locked;
            if (result.body[0].max_winners == 1) {
              this._winnerCount = { caption: 'Number of Winners 1', value: 1 }
            } else if (result.body[0].max_winners == 2) {
              this._winnerCount = { caption: 'Number of Winners 2', value: 2 }
            } else if (result.body[0].max_winners == 3) {
              this._winnerCount = { caption: 'Number of Winners 3', value: 3 }
            }
            for (let i = 0; i < result.body.length; i++) {
              const data = {
                group_id: result.body[i].group_id,
                group_type: result.body[i].group_type,
                category_id: result.body[i].category_id,
                event_id: result.body[i].event_id,
                group_details: result.body[i].group_details,
                label: 'Group ' + (i + 1),
                showButton: false,
                showDropDown: false,
                data: 'Pictures Folder1',
                playerAdded: 3,
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [],
              };
              this._groupList.push(data);
            }
          } else {
            this._isGroupCreated = false;
          }
        },
        error: (result) => {
          this._groupList = [];
          this._showLoader = false;
        },
        complete: () => { },
      });
  }
  getMainDraw() {
    // this._showLoader = true;
    this._currentEventId = localStorage.getItem('event_data');
    this.eventsService
      .getParticipantTypeAndCategories(
        JSON.parse(this._currentEventId).event_id
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          // this._currentCategoryId = result.body[0].categories[0].category_id;
        },
      });
    this._currentEventId = localStorage.getItem('event_data');
    const event_id = JSON.parse(this._currentEventId).event_id;
    const category_id = this._currentCategoryId;
    const group_type = 1;
    this.eventsService
      .getGroupList(this._eventId, this._currentCategoryId, 1)
      .subscribe({
        next: (result: any) => {
          this._groupList = [];
          this._showLoader = false;
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              group_id: result.body[i].group_id,
              group_type: result.body[i].group_type,
              category_id: result.body[i].category_id,
              event_id: result.body[i].event_id,
              group_details: result.body[i].group_details,
              label: 'Group ' + (i + 1),
              showButton: false,
              showDropDown: false,
              data: 'Pictures Folder1',
              playerAdded: 3,
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [],
            };
            this._groupList.push(data);
          }
        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => { },
      });
  }
  generateFixtures() {
    if (this._selectedPlayerForMainDraw.length > 0) {
      for (let i = 0; i < this._selectedPlayerForMainDraw.length; i++) {
        if (this._mainDrawParticipantsList.findIndex((x: any) => x == this._selectedPlayerForMainDraw[i].participant_id) == -1) {
          this._mainDrawParticipantsList.push(
            this._selectedPlayerForMainDraw[i].participant_id
          );
        }
      }
    }
    this._showLoader = true;
    if (this._winnerCount == undefined) {
      this._showLoader = false;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Kindly Select Number of Winner',
        life: 3000,
      });
    } else {
      this._showLoader = true;
      this._currentEventId = localStorage.getItem('event_data');
      const body = {
        event_id: JSON.parse(this._currentEventId).event_id,
        category_id: this._currentCategoryId,
        participant_type_id: this._currentParticipantId,
        max_winners:
          this._winnerCount == undefined || this._winnerCount.value == undefined ? 1 : this._winnerCount.value,
        main_draw_participants: this._mainDrawParticipantsList,
        min_no_participant: 3,
      };
      this.eventsService.generateFixtures(body).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._winnerCount = '';
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
          this._winnerCount = '';
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
  deleteFixtures() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this group? Once you delete the group all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader = true;
          this.eventsService.deleteFixtures(this._currentCategoryId, this._eventId).subscribe({
            next: (result: any) => {
              this._topPlayersList = [];
              this._showLoader = false;
              this._winnerCount = '';
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });
              this.getGroupList();
              this.getMainDraw();
              this.getPlayerList();
              this.getGroupMatchDetails();
            },
            error: (result: any) => {
              this._showLoader = false;
              this._winnerCount = '';
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
  createTeamMatches() {
    const body = {
      "event_id": this._eventId,
      "category_id": this._currentCategoryId,
      "parent_match_id": 0,
      "teamA_participant_id": 0,
      "teamB_participant_id": 0,
      "matches": [
        {
          "player_teamA": "string",
          "player_teamB": "string"
        }
      ]
    }
    this.eventsService.createTeamMatches(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._winnerCount = '';
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
        this._winnerCount = '';
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
  showPlayerSwap() {
    this._searchByPlayerNameSwap = '';
    this._grpSwapPlayer = true;
  }
  createCustomGroup() {
    this._finalGroupList = [];
    for (let i = 0; i < this._groupList.length; i++) {
      this._participantContainer = [];
      for (let j = 0; j < this._groupList[i].group_details.length; j++) {
        const data = {
          participant_id: this._groupList[i].group_details[j].participant_id,
          position: this._groupList[i].group_details[j].position,
        };
        this._participantContainer.push(data);
      }
      const data1 = {
        participants: this._participantContainer,
      };
      this._finalGroupList.push(data1);
    }
    const body = {
      event_id: JSON.parse(this._currentEventId).event_id,
      category_id: this._currentCategoryId,
      max_winners:
        this._winnerCount == undefined || this._winnerCount == null || this._winnerCount == ''
          ? 1
          : this._winnerCount.value,
      locked: true,
      groups: this._finalGroupList,
    };
    this.eventsService.createCustomGroups(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._winnerCount = '';
        // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
        this.createMatches();
      },
      error: (result: any) => {
        this._showLoader = false;
        this._winnerCount = '';
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
  justSave() {
    this.eventsService
      .lockGroup(
        JSON.parse(this._currentEventId).event_id,
        this._currentCategoryId
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._winnerCount = '';
          // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
          this.createMatches();
        },
        error: (result: any) => {
          this._showLoader = false;
          this._winnerCount = '';
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
    this.eventsService
      .createMatches(
        JSON.parse(this._currentEventId).event_id,
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
  getGroupMatchDetails() {
    this._matchDetailsList = [];
    this._showLoader = false;
    this.eventsService
      .getGroupMatchDetails(
        JSON.parse(this._currentEventId).event_id,
        this._currentCategoryId,
        1
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: result.body.msg,
          //   life: 3000,
          // });
          this._matchDetailsList = result.body;
          this.getPlayersForMainDraw();
          if (this._matchDetailsList.length > 0) {
            this.isMatchesCreated.emit(true)
          } else {
            this.isMatchesCreated.emit(false)
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
  playerForMainDraw(event: any, playerDetails: any) {
    if (event.target.checked) {

      this._topPlayers.splice(this._topPlayers.findIndex(
        (x: any) => x.user_id == playerDetails.user_id
      ),
        1)
      this._selectedPlayerForMainDraw.push(playerDetails);
           this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully Added Player In Main Draw',
            life: 3000,
          });
    } else {
      this._selectedPlayerForMainDraw.splice(
        this._selectedPlayerForMainDraw.findIndex(
          (x: any) => x.user_id == playerDetails.user_id
        ),
        1
      );
    }
  }
  deleteAllPlayerFromMainDraw() {
    if (this._selectedPlayerForMainDraw.length > 0 &&this._groupList.length == 0) {
      this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure ,you want to delete all players from main draw?.'
        )
        .then((confirmed) => {
          if (confirmed) {
            for (let i = 0; i < this._selectedPlayerForMainDraw.length; i++) {
              this._topPlayers.push(this._selectedPlayerForMainDraw[i]);
            }
            this._selectedPlayerForMainDraw = [];
          } else {
          }
        })
        .catch(() => { });
    }


  }
  getPlayersForMainDraw() {
    // this._showLoader = true;
    this._currentEventId = localStorage.getItem('event_data');
    const event_id = JSON.parse(this._currentEventId).event_id;
    const category_id = this._currentCategoryId;
    const group_type = 2;
    this.eventsService
      .getGroupList(event_id, category_id, group_type)
      .subscribe({
        next: (result: any) => {
          this._selectedPlayerForMainDraw = [];
          this._showLoader = false;
          if (result.body.length > 0) {
            for (let i = 0; i < result.body[0].group_details.length; i++) {
              for (let j = 0; j < this._topPlayers.length; j++) {
                if (result.body[0].group_details[i].participant_id == this._topPlayers[j].participant_id) {
                  this._topPlayers[j].isSelected = true;
                  // const data = {
                  //   user_id: 0,
                  //   name: result.body[0].group_details[i].participant_name,
                  //   email: result.body[0].group_details[i].email,
                  //   gender_id: 0,
                  //   isSelected: true,
                  //   club: result.body[0].group_details[i].club,
                  //   points: result.body[0].group_details[i].points == null ? 0 : result.body[0].group_details[i].points,
                  //   state: result.body[0].group_details[i].state,
                  //   participant_id: result.body[0].group_details[i].participant_id
                  // };
                  this._selectedPlayerForMainDraw.push(this._topPlayers[j])
                }

              }

            }
          }


        },
        error: (result) => {
          this._selectedPlayerForMainDraw = [];
          this._showLoader = false;
        },
        complete: () => { },
      });
  }
  removeFromMainDraw(data: any) {
    // this._topPlayers.splice(
    //   this._topPlayers.findIndex((x: any) => x.user_id == data.user_id),
    //   1
    // );
    const details = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      gender_id: data.gender_id,
      dob: data.dob,
      open_categories: data.open_categories,
      isSelected: false,
    };
    this._topPlayers.push(data);
    this._selectedPlayerForMainDraw.splice(
      this._selectedPlayerForMainDraw.findIndex(
        (x: any) => x.user_id == data.user_id
      ),
      1
    );
    this.messageService.add({
      key: 'bc',
      severity: 'success',
      summary: 'Success',
      detail: 'Removed Successfully',
      life: 3000,
    });
  }
  searchPlayer() {
    this._topPlayers = [];
    this._topPlayers = this._topPlayersCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
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
  swapPlayerWithGroup(playerDeatils: any, groupDetails: any) {
    this._playerSwapDataList = [];
    this._playerListWithGroupName = [];
    this._playerListWithGroupNameCopy = [];
    this._currentGroupName = '';
    for (let i = 0; i < this._groupList.length; i++) {
      for (let j = 0; j < this._groupList[i].group_details.length; j++) {
        const data = {
          index: j + 1,
          playerName: this._groupList[i].group_details[j].participant_name,
          playerId: this._groupList[i].group_details[j].participant_id,
          playerEmail: this._groupList[i].group_details[j].email == undefined ? '' : this._groupList[i].group_details[j].email,
          playerGroupName: this._groupList[i].label,
          playerGroupId: this._groupList[i].group_id,
          playerStateName: this._groupList[i].group_details[j].state == undefined ? '' : this._groupList[i].group_details[j].state,
          playerClubName: this._groupList[i].group_details[j].club,
          playerPoints:
            this._groupList[i].group_details[j].points == null
              ? 0
              : this._groupList[i].group_details[j].points,
        };
        if (playerDeatils.participant_id !== data.playerId) {
          this._playerListWithGroupName.push(data);
          this._playerListWithGroupNameCopy.push(data);
        }
      }
    }
    //   const data1 = {
    //     "participant_id": playerDeatils,
    //     "group_id": 2651,
    //     "position": 3,
    //     "id": 13660,
    //     "points": null,
    //     "participant_name": "SID"
    // }
    //   
    this._currentGroupName = groupDetails.label;
    this._playerSwapDataList.push(playerDeatils);

    this._grpSwapPlayer = true;
  }
  swapGroupPlayer(data: any) {
    this._groupList = [];
    this._groupList = data;
    this._grpSwapPlayer = false;
  }
  ClosePopUp() {
    // this.getPlayerList();
  }
  deleteFixture() {

  }
}
