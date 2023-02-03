import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-reg-teams',
  templateUrl: './reg-teams.component.html',
  styleUrls: ['./reg-teams.component.scss'],
})
export class RegTeamsComponent {
  _teamName: any;
  _selectedEvent: boolean = false;
  _nextScreen: boolean = false;
  _playerInfo: any = [
    {
      name: 'Sample Name',
      email: 'xyzsample@yopmail.com',
      events: [
        { name: "Men's", checked: true },
        { name: 'Sample Text', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
      ],
      eventAmount: 12 + '$',
    },
    {
      name: 'Sample Name',
      email: 'xyzsample@yopmail.com',
      events: [
        { name: "Men's", checked: true },
        { name: 'Sample Text', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
      ],
      eventAmount: 12 + '$',
    },
    {
      name: 'Sample Name',
      email: 'xyzsample@yopmail.com',
      events: [
        { name: "Men's", checked: true },
        { name: 'Sample Text', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
      ],
      eventAmount: 12 + '$',
    },
    {
      name: 'Sample Name',
      email: 'xyzsample@yopmail.com',
      events: [
        { name: "Men's", checked: true },
        { name: 'Sample Text', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
        { name: 'Sample ', checked: false },
      ],
      eventAmount: 12 + '$',
    },
  ];
  _playersTable: any = [
    { name: 'SAmple name12', email: 'xyzsample@gmail.com' },
    { name: 'SAmple name12', email: 'xyzsample@gmail.com' },
    { name: 'SAmple name12', email: 'xyzsample@gmail.com' },
    { name: 'SAmple name12', email: 'xyzsample@gmail.com' },
    { name: 'SAmple name12', email: 'xyzsample@gmail.com' },
  ];
  // _players: any = [
  //   { name: 'Player 1' },
  //   { name: 'Player 2' },
  //   { name: 'Player 3' },
  // ];
  _playerArray: any = [{}, {}, {}, {}];
  _group: any = [{}, {}, {}, {}];
  _teams: any = [];
  @Input() categories: any = [];
  @Input() _eventId!: number;
  _dummyList: any;
  _players: any = [];
  _totalAmount: any = 0;
  _showLoader: boolean = false;
  _teamPlayerList: any = [];
  @Input() _participant_Id: any;
  _playerInCategories: any = [];
  _playersCopy: any = [];
  _searchTeams: any = '';
  _selectedCategory: any
  constructor(private dashboardService: DashboardService, private eventService: EventsService,
    private messageService: MessageService, private route: Router) { }
  ngOnInit(): void {
    this.getTeams();
    this.categories;
    this._eventId;
  }
  setName() {
  }
  currentEvent(eventDetails: any, index: any, catIndex: any) {
    if (eventDetails.target.checked) {
      this._players[index].eventAmount = this._players[index].eventAmount + this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = true;
      this._players[index].categories_list[catIndex].isSelected = true;
      this._totalAmount = this._totalAmount + this._players[index].categories_list[catIndex].price;

    } else {
      this._players[index].eventAmount = this._players[index].eventAmount - this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = false;
      this._players[index].categories_list[catIndex].isSelected = false;
      this._totalAmount = this._totalAmount - this._players[index].categories_list[catIndex].price;
    }

  }
  getTeams() {
    this.dashboardService.getTeamsByParticipantIDAndEventId(2).subscribe({
      next: (data: any) => {
        this._teams = [];
        this._playerInCategories = [];
        this._players = [];
        this._playersCopy = [];
        this._teams = data.body;
        for (let i = 0; i < this._teams.length; i++) {
          this._playerInCategories = [];
          if (this._teams[i].open_categories.length > 0) {
            for (let j = 0; j < this.categories.length; j++) {

              if (this._teams[i].open_categories.includes(this.categories[j].category_id)) {
                const ddd = {
                  categoryName: this.categories[j].category_description,
                  categoryId: this.categories[j].category_id,
                  price: this.categories[j].price,
                  isSelected: false,
                }
                if (this._playerInCategories.findIndex((x: any) => x.categoryId == this.categories[j].category_id) == -1) {
                  this._playerInCategories.push(ddd)
                }


              }

            }
            this._dummyList = {
              player_id: this._teams[i].team_id,
              player_name: this._teams[i].name,
              state: this._teams[i].team_details[0].state,
              club: this._teams[i].team_details[0].club,
              email: this._teams[i].team_details[0].email,
              playerList: this._teams[i].team_details,
              isChecked: false,
              eventAmount: 0,
              categories_list: this._playerInCategories
            };
            if (this._dummyList != undefined) {
              if (this._players.findIndex((x: any) => x.player_id == this._dummyList.player_id) == -1) {
                this._players.push(this._dummyList);
                this._playersCopy.push(this._dummyList);
              }
            }
          }
        }
      },
      error: (result: any) => {
        // this.messageService.add({
        //   key: 'bc',
        //   severity: 'error',
        //   summary: 'Info',
        //   detail: result.error.msg,
        //   life: 3000,
        // });
      },
      complete: () => {
      },
    });
  }
  payNow() {
    this._showLoader = true;
    var list;
    var category
    const categories = [];
    const participants = [];
    for (let i = 0; i < this.categories.length; i++) {
      // category = this.categories[i].category_id;
      for (let f = 0; f < this._players.length; f++) {
        for (let k = 0; k < this._players[f].categories_list.length; k++) {
          // category = this.categories[i].category_id;
          if ((this._players[f].categories_list[k].isSelected) && this.categories[i].category_id == this._players[f].categories_list[k].categoryId) {
            this._selectedCategory = this._players[f].categories_list[k].categoryId
          }
        }
      }
      for (let j = 0; j < this._players.length; j++) {
        if (this._players[j].isChecked) {
          this._teamPlayerList = [];
          for (let f = 0; f < this._players[j].playerList.length; f++) {
            const playerData = {
              "user_id": this._players[j].playerList[f].user_id,
              "state": this._players[j].playerList[f].state,
              "club": this._players[j].playerList[f].club,
              "email": this._players[j].playerList[f].email,
              "name": this._players[j].playerList[f].name
            }
            this._teamPlayerList.push(playerData)
          }
          list =
          {
            "participant_name": this._players[j].player_name,
            "ref_id": this._players[j].player_id,
            "players": this._teamPlayerList
          }
          // participants.push(list);
          if (participants.findIndex((x: any) => x.ref_id == this._players[j].player_id) == -1) {
            participants.push(list);
          }
        }
      }
      if (this._selectedCategory !== undefined) {

        if (categories.findIndex((x: any) => x.category_id == this._selectedCategory) == -1) {
          categories.push({ "category_id": this._selectedCategory, "participants": participants })
        }

      }
      // categories.push({ "category_id": category, "participants": participants })
    }
    if (this._totalAmount > 0) {
      const data = {
        "event_id": this._eventId,
        "participant_type_id": 2,
        "categories": categories
      }
      this.eventService.registerParticipants(data).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Registration Completed', life: 3000, });
          this.getTeams();
          // window.open(result.body.payment_url);
          window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');
          // this.route.navigate(['/home']);

        },
        error: (result) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
          });
        },
        complete: () => {

        },
      });
    }
    else {
      //some message here
    }
  }
  findTeams() {
    this._players = this._playersCopy.filter((item: any) => {
      return item.player_name.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
}
