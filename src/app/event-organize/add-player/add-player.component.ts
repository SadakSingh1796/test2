import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
  providers: [MessageService,ConfirmationDialogService],
})
export class AddPlayerComponent implements OnInit {
  _showAddPlayer: boolean = false;
  showDialog: boolean = false;
  _showHistoryDialog: boolean = false;
  _showTeamPlayers: boolean = false;
  _openRecentlyDeleted: boolean = false;
  _showLoader: boolean = false;
  _selectedFixtureFormat: any;
  _selectedParticipantTypes: any;
  _display: any;
  _eventFixtureFormat: any;
  _categoryId: any;
  _eventId: any;
  _window: any;
  _generateFixtureFormat: any = [];
  _formatDrpDown: any = [];
  _players: any = [];
  _playersCopy: any = [];
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _participantTypesList: any = [];
  _categoryList: any = [];
  _mergeCategoryList: any = [];
  _anotherCategoryList: any = [];
  _teamPlayers: any = [];
  _searchByPlayerName: any = '';
  _searchByTeamName: any = '';
  _currentEventId: any = '';
  _currentParticipantId: any = '';
  selectedFixture: any = '';
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this._window = window.pageYOffset;
  }
  _fixtureFormat = [
    { name: 'Knockout' },
    { name: 'Group Play off' },
    { name: 'Round Robin' },
  ];
  _fixtureName: any;
  _isDisabled: boolean = false;
  _tabIndex: any
  constructor(private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService, private jsonDataCallingService: JsonDataCallingService,
    private registrationService: EventsService,
    private playerService: PlayerServiceService,
    public router: Router,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.eventsFixtureFormat();
    this.getParticipantAndCategories();
  }
  eventsFixtureFormat() {
    this.jsonDataCallingService.eventsFixtureFormat().subscribe({
      next: (result: any) => {
        this._eventFixtureFormat = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  srollTop() {
    window.scrollTo(0, 0);
    window.pageXOffset + window.pageYOffset;
  }
  openAddPlayer() {
    this._showAddPlayer = true;
    this._openRecentlyDeleted = false;
  }
  landPage(data: any) {
    this._showAddPlayer = data;
    this._openRecentlyDeleted = data;
  }
  mergeCategories() {
    this._mergeCategoryList = [];
    for (let i = 0; i < this._categoryList.length; i++) {
      const data = {
        categoryName: this._categoryList[i].category_description,
        numberOfPlayer: '10',
        eventId: this._eventId,
        isSelectedCategory: false,
        category_id: this._categoryList[i].category_id
      }
      this._mergeCategoryList.push(data)
    }
    this.showDialog = true;
  }
  openHistoryDialog() {
    this._showHistoryDialog = true;
    this._openRecentlyDeleted = false;
  }
  openRecentlyDeleted() {
    this._openRecentlyDeleted = true;
    this._showHistoryDialog = false;
    this._showAddPlayer = false;
  }
  getParticipantAndCategories() {
    this.registrationService.getParticipantTypeAndCategories(this._eventId).subscribe({
      next: (result: any) => {
        this._selectedFixtureFormat = result.body;
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = result.body[0];
        this._categoryList = result.body[0].categories;
        this._display = this._selectedFixtureFormat[0].categories;
        this._categoryId = this._selectedFixtureFormat[0].categories[0].category_id;
        this._currentParticipantId = this._selectedFixtureFormat[0].participant_type_id;
        this._tabIndex = 0;
        if (this._categoryList[0].format_id == null) {
          this.selectedFixture = '';
          this._isDisabled = false;
        } else {
          this.selectedFixture = this._categoryList[0].format_id
          this._isDisabled = true
        }
        this.getPlayerList();
      },
      error: () => { },
      complete: () => { },
    });
  }
  deleteFixture() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this fixture format? Once you delete the fixture format all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.playerService
            .deleteFixtureFormat(this._eventId, this._categoryId)
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
                this.getParticipantAndCategories();
              },
              error: (result) => {
                this._showLoader = false;
                this.messageService.add({
                  key: 'bc',
                  severity: 'error',
                  summary: 'error',
                  detail: 'Some Error Occured',
                  life: 3000,
                });
              },
              complete: () => { },
            });

        } else {
        }
      })
      .catch(() => { });


  }
  deleteSelectedFixture() {

  }
  generateFixture() {
    if (this.selectedFixture != '') {
      this._showLoader = true;
      this.playerService
        .updateFixtureFormat(this._eventId, this.selectedFixture, this._categoryId)
        .subscribe({
          next: (result: any) => {
            this._categoryList[this._tabIndex].format_id = this.selectedFixture;
            this._isDisabled = true;
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          },
          error: (result) => {
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'error',
              detail: 'Some Error Occured',
              life: 3000,
            });
          },
          complete: () => { },
        });
    }
    // this.selectedFixture = '';
  }
  onFixtureGenerate(event: any) {
    this._formatDrpDown = [];
    this._formatDrpDown.push(event.value);
  }
  deleteGenerated(event: any) {
    for (let i = 0; i < this._formatDrpDown.length; i++) {
      this._generateFixtureFormat.splice(i, 1);
      this._fixtureFormat.push(event);
    }
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  getPlayerList() {
    this._showLoader = true;
    this.registrationService.getEventRegistedPlayers(this._eventId, this._currentParticipantId, this._categoryId).subscribe({
      next: (result: any) => {
        if (this._currentParticipantId == 1) {
          this._players = [];
          this._playersCopy = [];
          this._showLoader = false;
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              "user_id": result.body[i].event_participant_details[0].user_id,
              "name": result.body[i].participant_name,
              "email": result.body[i].event_participant_details[0].email,
              "gender_id": result.body[i].event_participant_details[0].gender_id,
              "isSelected": false,
              "club": result.body[i].name,
              "points": result.body[i].points == null ? 0 : result.body[i].points,
              "state": result.body[i].event_participant_details[0].state,
              "participant_id": result.body[i].participant_id
            }
            this._players.push(data);
            this._playersCopy.push(data);
          }
        } else if (this._currentParticipantId == 2) {
          this._showLoader = false;
          this._teamList = []
          this._teamListCopy = [];
          this._teamList = result.body;
          this._teamListCopy = result.body;
        } else if (this._currentParticipantId == 3) {
          this._showLoader = false;
          this._doubleList = []
          this._doubleListCopy = [];
          this._doubleList = result.body;
          this._doubleListCopy = result.body;
        } else if (this._currentParticipantId == 4) {
          this._showLoader = false;
          this._mixDoubleList = []
          this._mixDoubleListCopy = [];
          this._mixDoubleList = result.body;
          this._mixDoubleListCopy = result.body;
        }

      },
      error: (result: any) => {
        this._players = [];
        this._playersCopy = [];
        this._showLoader = false;
        // this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
      },
      complete: () => { },
    });
  }
  currentParticipant(data: any) {
    this._tabIndex = 0
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    if (this._categoryList.length > 0) {
      this._categoryId = this._categoryList[0].category_id;
      this.getPlayerList();
    }
    if (this._categoryList[0].format_id == null) {

      this.selectedFixture = '';
      this._isDisabled = false;
    } else {

      this.selectedFixture = this._categoryList[0].format_id
      this._isDisabled = true;

    }
  }
  tabSelection(data: any) {
    this._tabIndex = data.index;
    this._categoryList[data.index];
    this._categoryId = this._categoryList[data.index].category_id;
    // this.selectedFixture = this._categoryList[data.index].format_id
    if (this._categoryList[data.index].format_id == null) {

      this.selectedFixture = '';
      this._isDisabled = false;
    } else {

      this.selectedFixture = this._categoryList[data.index].format_id
      this._isDisabled = true;

    }
    this.getPlayerList();
  }
  searchPlayer() {
    this._players = this._playersCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.state
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  searchTeam() {
    this._teamList = this._teamListCopy.filter((item: any) => {
      return (
        item.participant_name
          .toLowerCase()
          .includes(this._searchByTeamName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByTeamName.toLowerCase())
      );
    });
  }
  refreshPlayerList() {
    this.getPlayerList();
  }
  getAnotherCategoryList() {
    this._anotherCategoryList = this._categoryList.filter((x: any) => x.category_id !== this._categoryId)
  }
  updateParticipantCategory(fullDetails: any, participantDetails: any) {
    this._showLoader = true;
    this.playerService.updateParticipantCategory(participantDetails.participant_id, fullDetails.category_id, this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.getPlayerList();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
      },
      complete: () => { },
    });
  }
  viewTeamPlayerList(fullDetails: any) {
    this._showTeamPlayers = true;
    this._teamPlayers = fullDetails.event_participant_details;
  }
}
