import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
@Component({
  selector: 'stupa-match-scheduler',
  templateUrl: './match-scheduler.component.html',
  styleUrls: ['./match-scheduler.component.scss'],
  providers: [MessageService],
})
export class MatchSchedulerComponent implements OnInit {
  _participantTypesList: any = [];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
    // { name: 'Knockout', key: 'K' },
    // { name: 'Round-Robin', key: 'RR' },
    // { name: 'Group-PlayOff', key: 'GPO' }
  ];
  _selectedFixtureFormat: any = null;
  _parent_match_id: any = '';
  _teamA_participant_id: any = '';
  _teamB_participant_id: any = '';
  _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _currentEventId: any;
  _categoryList: any = [];
  @Input() _matchDetailsList: any = [];
  @Input() _matchDetailsListCopy: any = [];
  _matchListForScoreUpdate: any = [];
  _matchListForScoreUpdateCopy: any = [];
  _matchFullDetails: any = [];
  @Output() getListWithCategoryId = new EventEmitter<any>();
  _event_id: any;
  _availableSlots: any = [];
  _selectedGroup: any;
  _slots: any = [];
  _editScore: boolean = false
  _plannedList: any = [];
  _daysList: any = [];
  _showLoader: boolean = false;
  _monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  _dateIntervalList: any = [];
  _currentTimeSlot: any = [];
  _currentSlotId: any;
  _currentPlannerId: any;
  _currentStartTime: any;
  _currentEndTime: any;
  _currentDaySlots: any = [];
  _searchByPlayerName: any = '';
  _searchByPlayerNameUpdateScore: any = '';
  _teamMatchFullDetails: any = [];
  _teamAPlayers: any = [];
  _teamBPlayers: any = [];
  _teamAPlayersCopy: any = [];
  _teamBPlayersCopy: any = [];
  // @Input() _fixtureFormat: any = [];
  @Output() getLeftMathesForSlots = new EventEmitter<any>();
  @Input() _tabIndex: any;
  _scoreArray: any = [];
  @Output() _isScoreUpadted = new EventEmitter<any>();
  @Input() _categoryName: any
  @Input() selectedParticipantId: any;
  @Input() selectedCategoryId: any
  @Input() isKnockout: boolean = false;
  _groupId: any;
  constructor(private encyptDecryptService: EncyptDecryptService,
    private eventsService: EventsService,
    private messageService: MessageService,
    private fixtureService: FixtureServiceService,
    private route: Router) {
    // this._selectedFixtureFormat = this._fixtureFormat[2];
  }

  ngOnInit(): void {
    this._tabIndex = localStorage.getItem('tabIndex')
    this._event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getEventPlannerDetails();
    this.getParticipantTypeAndCategories();
    this.getPlannerDates();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getParticipantTypeAndCategories();
    // this._tabIndex = localStorage.getItem('tabIndex')
  }
  updateScore(data: any) {

    if (false) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._event_id, this._currentCategoryId, data.match_id).subscribe({
        next: (result: any) => {
          this._teamMatchFullDetails = [];
          this._teamMatchFullDetails = result.body;
          this._teamAPlayers = [];
          this._teamBPlayers = [];
          this._teamAPlayersCopy = [];
          this._teamBPlayersCopy = [];
          this._teamAPlayersCopy = result.body[0].event_participant_details;;
          this._teamBPlayersCopy = result.body[1].event_participant_details;
          this._teamAPlayers = result.body[0].event_participant_details;
          this._teamBPlayers = result.body[1].event_participant_details;
          this._teamA_participant_id = result.body[0].event_participant_details[0].participant_id;
          this._teamB_participant_id = result.body[1].event_participant_details[0].participant_id;
          this._editScore = true
        },
        error: (result: any) => { },
        complete: () => { },
      });
    } else if (false) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._event_id, this._currentCategoryId, data.match_id).subscribe({
        next: (result: any) => {
          this._teamMatchFullDetails = [];
          this._teamMatchFullDetails = result.body;
          this._teamAPlayers = [];
          this._teamBPlayers = [];
          this._teamAPlayers = result.body[0].event_participant_details;
          this._teamBPlayers = result.body[1].event_participant_details;
          this._teamAPlayersCopy = result.body[0].event_participant_details;;
          this._teamBPlayersCopy = result.body[1].event_participant_details;
          this._teamA_participant_id = result.body[0].event_participant_details[0].participant_id;
          this._teamB_participant_id = result.body[1].event_participant_details[0].participant_id;
          this._editScore = true
        },
        error: (result: any) => { },
        complete: () => { },
      });
    } else if (this.selectedParticipantId == 2) {

      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._event_id, this._categoryList[0].category_id, data.match_id).subscribe({
        next: (result: any) => {
          this._teamMatchFullDetails = [];
          this._teamMatchFullDetails = result.body;
          this._teamAPlayers = [];
          this._teamBPlayers = [];
          this._teamAPlayers = result.body[0].event_participant_details;
          this._teamBPlayers = result.body[1].event_participant_details;
          this._teamAPlayersCopy = result.body[0].event_participant_details;;
          this._teamBPlayersCopy = result.body[1].event_participant_details;
          this._teamA_participant_id = result.body[0].event_participant_details[0].participant_id;
          this._teamB_participant_id = result.body[1].event_participant_details[0].participant_id;
          this._groupId = data.group_id;
          this._editScore = true
        },
        error: (result: any) => { },
        complete: () => { },
      });
    } else if (this.selectedParticipantId == 1 || this.selectedParticipantId == 3 || this.selectedParticipantId == 4) {
      this._matchFullDetails = [];
      this._scoreArray = [];
      for (let f = 0; f < data.sets.length; f++) {
        const dd = { value: this.digits_count(data.sets[f]) + '-' + this.digits_count(data.sets[f]) }
        this._scoreArray.push(dd)
      }
      const dd = {
        "round_name": data.round_name,
        "group_id": data.group_id,
        "match_id": data.match_id,
        "category_id": data.category_id,
        "group_name": data.group_name,
        "participantA_id": data.participantA_id,
        "participantB_id": data.participantB_id,
        "participantA_name": data.participantA_name,
        "participantB_name": data.participantB_name,
        "isSelected": false,
        "event_id": data.event_id,
        "sets": this._scoreArray
      }
      this._matchFullDetails.push(dd);
      this._editScore = true
    }
  }
  getPlannerDates() {
    this._showLoader = true;
    this.eventsService.getPlannerDates(this._event_id).subscribe({
      next: (result: any) => {
        this._daysList = [];
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            dayCount: 'Day' + (i + 1),
            dayDate: result.body[i].day.split('T')[0].split('-')[2] + '-' + this._monthNames[result.body[i].day.split('T')[0].split('-')[1] - 1],
            isSelectedDay: i == 0 ? true : false,
            planner_id: result.body[i].intervals.length > 0 ? result.body[i].planner_id : 0,
            dayDateFromBackEnd: result.body[i].day,
            intervals: result.body[i].intervals
          }
          this._daysList.push(data);
        }
        this._showLoader = false;
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
      },
    })
  }
  getSelectedDateInterval(data: any) {
    this._currentTimeSlot = [];
    this._dateIntervalList = [];
    this._slots = [];
    if (this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals.length > 0) {
      for (let i = 0; i < this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals.length; i++) {
        const db = {
          dateInterval: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time.split('T')[1].split(':')[0] + ':' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time.split('T')[1].split(':')[1] + '-' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time.split('T')[1].split(':')[0] + ':' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time.split('T')[1].split(':')[1],
          start_time: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time,
          end_time: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time,
          planner_id: data.value.planner_id
        }
        this._dateIntervalList.push(db)
      }
    }
  }
  getSlotMatches(data: any) {
    this._currentPlannerId = data.value.planner_id;
    this._currentStartTime = data.value.start_time;
    const status = 'all';
    this._currentEndTime = data.value.end_time;
    this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
      next: (result: any) => {

        this._slots = [];
        this._slots = result.body;
        this._currentSlotId = result.body[0].slot_id
        this.getSlotMatchedForScoreUpdate();
      },
      error: (result: any) => { },
      complete: () => { },
    });
  }
  getSlotMatchedForScoreUpdate() {
    const status = 'in_progress'
    this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
      next: (result: any) => {
        this._matchListForScoreUpdate = [];
        this._matchListForScoreUpdateCopy = [];
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            "round_name": 'R' + result.body[i].round,
            "group_id": result.body[i].group_id,
            "match_id": result.body[i].match_id,
            "category_id": result.body[i].category_id,
            "group_name": result.body[i].group_name,
            "participantA_id": result.body[i].match_details[0].participant_id,
            "participantB_id": result.body[i].match_details[1].participant_id,
            "participantA_name": result.body[i].match_details[0].participant_name,
            "participantB_name": result.body[i].match_details[1].participant_name,
            "isSelected": false,
            "event_id": result.body[i].event_id,
            "sets": result.body[i].match_details[1].sets
          }
          this._matchListForScoreUpdate.push(data);
          this._matchListForScoreUpdateCopy.push(data);
        }
      },
      error: (result: any) => { },
      complete: () => { },
    });
  }
  deleteMatchSlot(data: any) {

    const planner_id = data.planner_id;
    const slot_id = data.slot_id;
    const match_id = data.match_id
    if ((planner_id !== undefined || slot_id !== undefined || match_id != undefined) && (planner_id !== null || slot_id !== null || match_id != null)) {
      this._showLoader = true;
      this.eventsService.deleteMatchSlot(this._event_id, planner_id, slot_id, match_id).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._slots = [];
          this._slots = result.body;
          const status = 'all';
          this.getGroupMatchDetails(this._categoryList[0].category_id)
          // this.getLeftMathesForSlots.emit(this._currentCategoryId);
          this.getSlotMatchedForScoreUpdate();
          this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
            next: (result: any) => {
              this._slots = [];
              this._slots = result.body;
              this._currentSlotId = result.body[0].slot_id
              this.getSlotMatchedForScoreUpdate();
            },
            error: (result: any) => { },
            complete: () => { },
          });
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => { },
      });
    }
  }
  digits_count(n: any) {
    if (n == 0) { return '00'; }
    else if (n == undefined) {
      return '00-00';
    } else if (n == 10) {
      return n;
    } else {
      var count = 0;
      if (n >= 1) ++count;

      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }
      if (count > 1) {
        return n
      } else {
        return '0' + n;
      }
    }
  }
  getParticipantTypeAndCategories() {
    this.eventsService.getParticipantTypeAndCategories(this._event_id).subscribe({
      next: (result: any) => {

        this.selectedParticipantId
        this._participantTypesList = result.body;
        this._selectedParticipantTypes = this._participantTypesList[0];
        this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
        // this._categoryList = this._participantTypesList[0].categories;
        this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == this.selectedParticipantId)[0].categories.filter((x: any) => x.category_id == this.selectedCategoryId)
        this.getGroupMatchDetails(this._categoryList[0].category_id)
        // this._currentCategoryId = this._categoryList[0].category_id;
        // this.selectedFixtureFormat(this._categoryList[this._tabIndex].format_description)
      },
      error: (result: any) => { },
      complete: () => { },
    });
  }

  selectedFixtureFormat(data: any) {

    if (data == 'knockout') {
      this._selectedFixtureFormat = 'Knockout'
      this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
    } else if (data == 'round robin') {
      this._selectedFixtureFormat = 'Round-Robin'
      this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
    } else if (data == 'play off') {
      this._selectedFixtureFormat = 'Group-PlayOff'
      this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
    } else {
      this._fixtureFormat = []
    }
    // { name: 'Knockout', key: 'K' },
    // { name: 'Round-Robin', key: 'RR' },
    // { name: 'Group-PlayOff', key: 'GPO' }
  }
  updateMatchSlot(details: any) {

    if (this._slots.findIndex((x: any) => x.match_id == null) > -1) {
      this._showLoader = true;
      this._currentSlotId = this._slots[this._slots.findIndex((x: any) => x.match_id == null)].slot_id
      const dd = {
        "event_id": details.event_id,
        "planner_id": this._currentPlannerId,
        "slot_id": this._currentSlotId,
        "match_id": details.match_id,
        "participant_id_A": details.participantA_id,
        "participant_name_A": details.participantA_name,
        "participant_id_B": details.participantB_id,
        "participant_name_B": details.participantB_name,
        "start_time": this._currentStartTime,
        "end_time": this._currentEndTime,
        "live_stream": true
      }
      this.eventsService.updateMatchSlot(dd).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 4000,
          });
          // this.getLeftMathesForSlots.emit(this._currentCategoryId);
          this.getGroupMatchDetails(this._categoryList[0].category_id)
          this.getSlotMatchedForScoreUpdate();
          this._showLoader = true;
          this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, 'all', this._currentStartTime, this._currentEndTime).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this._slots = [];
              this._slots = result.body;

            },
            error: (result: any) => {
              this._showLoader = false;

            },
            complete: () => { },
          });
        },
        error: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 4000,
          });
        },
        complete: () => { },
      });
    } else {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'No Slot Left In Seleted Date',
        life: 4000,
      });
    }

  }
  currentParticipant(data: any) {
    this._tabIndex = 0;
    this._currentDaySlots = [];
    this._dateIntervalList = [];
    this._currentTimeSlot = [];
    this._slots = [];
    this._matchListForScoreUpdate = [];
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this.selectedFixtureFormat(this._categoryList[this._tabIndex].format_description)
    // if (this._categoryList[this._tabIndex].format_description == 'knockout') {
    //   this._selectedFixtureFormat = 'Knockout'
    //   this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
    // } else if (this._categoryList[this._tabIndex].format_description == 'round robin') {
    //   this._selectedFixtureFormat = 'Round-Robin'
    //   this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
    // } else if (this._categoryList[this._tabIndex].format_description == 'play off') {
    //   this._selectedFixtureFormat = 'Group-PlayOff'
    //   this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
    // }
    this.getListWithCategoryId.emit(this._categoryList[0].category_id);
    this.getPlannerDates();
  }
  tabSelection(data: any) {

    this._currentDaySlots = [];
    this._dateIntervalList = [];
    this._currentTimeSlot = [];
    this._slots = [];
    this._matchListForScoreUpdate = [];
    this._searchByPlayerName = '';
    this._searchByPlayerNameUpdateScore = '';
    // this._tabIndex = data.index;
    this._currentCategoryId = this._categoryList[this._tabIndex].format_description
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this.selectedFixtureFormat(this._categoryList[data.index].format_description)
    this.getListWithCategoryId.emit(this._categoryList[data.index].category_id);
    this.getPlannerDates();
  }
  getEventPlannerDetails() {
    this.eventsService.getEventPlannerDetails(this._event_id, 1).subscribe({
      next: (result: any) => {
        this._plannedList = [];
        this._plannedList = result.body;
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            date: new Date(this._plannedList[i].date).getDay() + '/' + new Date(this._plannedList[i].date).getDate() + '/' + new Date(this._plannedList[i].date).getFullYear()
          }
          if (this._availableSlots.findIndex((x: any) => x.date == data.date) == -1) {
            this._availableSlots.push(data);
          }
        }
      },
      error: (result: any) => { },
      complete: () => { },
    });
  }
  searchPlayer() {
    this._matchDetailsList = this._matchDetailsListCopy.filter((item: any) => {
      return (
        item.participantA_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participantB_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  searchPlayerFromUpdateScore() {
    this._matchListForScoreUpdate = this._matchListForScoreUpdateCopy.filter((item: any) => {
      return (
        item.participantA_name
          .toLowerCase()
          .includes(this._searchByPlayerNameUpdateScore.toLowerCase()) ||
        item.participantB_name
          .toLowerCase()
          .includes(this._searchByPlayerNameUpdateScore.toLowerCase())
      );
    });
  }
  teamMatchCreated(data: any) {
    this._editScore = false;
    this.getSlotMatchedForScoreUpdate();
  }
  isScoreUpadted(data: any) {
    this._isScoreUpadted.emit(data)
  }
  goAtDayPlanner() {
    localStorage.setItem('isOpenDayPlanner', 'true')
    this.route.navigate(['/event/create-event']);
  }
  getGroupMatchDetails(categoryId: any) {

    if (this.isKnockout) {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = [];
      this._showLoader = false;
      this.eventsService.getGroupMatchDetailsV2(this._event_id, categoryId, 1)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this._matchDetailsList = [];
            this._matchDetailsListCopy = [];
            if (result.body.length > 0) {
              for (let j = 0; j < result.body.length; j++) {
                if (result.body[j].match_details.length > 1) {
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
      // this.fixtureService.generateFirstRoundKnockout(this._event_id, this._categoryList[0].category_id).subscribe({
      //   next: (result: any) => {

      //     this._showLoader = false;
      //     console.log(result);
      //     this._matchDetailsList = [];
      //     this._matchDetailsListCopy = [];
      //     for (let j = 0; j < result.body.length; j++) {
      //       const data = {
      //         "round_name": 'R' + result.body[j].round,
      //         "group_id": result.body[j].group_id,
      //         "match_id": result.body[j].match_id,
      //         "category_id": result.body[j].category_id,
      //         "group_name": 'G' + (j + 1),
      //         "participantA_id": result.body[j].match_details[0].participant_id,
      //         "participantB_id": result.body[j].match_details[1].participant_id,
      //         "participantA_name": result.body[j].match_details[0].participant_name,
      //         "participantB_name": result.body[j].match_details[1].participant_name,
      //         "isSelected": false,
      //         "event_id": this._event_id,
      //       }
      //       this._matchDetailsList.push(data);
      //       this._matchDetailsListCopy.push(data);
      //     }

      //     // this.messageService.add({
      //     //   key: 'bc',
      //     //   severity: 'success',
      //     //   summary: 'Success',
      //     //   detail: result.body.msg,
      //     //   life: 3000,
      //     // });
      //   },
      //   error: (result: any) => {
      //     this._showLoader = false;
      //     this.messageService.add({
      //       key: 'bc',
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: result.error.msg,
      //       life: 3000,
      //     });
      //   },
      //   complete: () => { },
      // });
    } else {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = [];
      this._showLoader = false;
      this.eventsService.getGroupMatchDetailsV2(this._event_id, categoryId, 1)
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
  }
  refreshAll() {
    this.getSlotMatchedForScoreUpdate();
  }
}

