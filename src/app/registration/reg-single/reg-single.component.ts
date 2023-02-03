import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-reg-single',
  templateUrl: './reg-single.component.html',
  styleUrls: ['./reg-single.component.scss'],
  providers: [MessageService]
})
export class RegSingleComponent {
  _selectedEvent: boolean = false;
  @Input() categories: any = [];
  @Input() _eventId!: number;
  _totalAmount: any = 0;
  _playerList: any = [];
  _playersList: any = [];
  _categoryList: any = [];
  _players: any = [];
  _playersCopy: any = [];
  _dummyList: any;
  _showLoader: boolean = false;
  _playerInCategories: any = [];
  _searchTeams: any = '';
  _selectedCategory: any;
  _participantList: any = [];
  _categoriesList: any = [];
  _categoriesListFinal: any = [];
  constructor(private eventService: EventsService, private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService, private route: Router) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.categories;
    this.getPlayers();
    this._players;
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
  onCategoryClick() {

  }
  getPlayers() {
    this._showLoader = true;
    this.eventService.getPlayers(this._eventId).subscribe({
      next: (data: any) => {
        this._playersList = [];
        this._playersCopy = [];
        this._players = [];
        this._playersCopy = [];
        this._playersList = data.body;
        this._showLoader = false;
        for (let i = 0; i < this._playersList.length; i++) {
          this._playerInCategories = [];
          if (this._playersList[i].open_categories.length > 0) {
            for (let j = 0; j < this.categories.length; j++) {
              if (this._playersList[i].open_categories.includes(this.categories[j].category_id)) {
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
              player_id: this._playersList[i].user_id,
              player_name: this._playersList[i].name,
              email: this._playersList[i].email,
              state: this._playersList[i].state,
              club: this._playersList[i].club,
              isChecked: false,
              eventAmount: 0,
              categories_list: this._playerInCategories
            };
            if (this._dummyList != undefined) {
              if (this._players.findIndex((x: any) => x.player_id == this._dummyList.player_id) == -1) {
                this._players.push(this._dummyList)
                this._playersCopy.push(this._dummyList);
              }
            }
          }
        }
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
  payNow() {
    this._showLoader = true;
    var list;
    this._players
    this._categoriesList = [];
    for (let i = 0; i < this._players.length; i++) {
      this._participantList = [];
      for (let k = 0; k < this._players[i].categories_list.length; k++) {
        if (this._players[i].categories_list[k].isSelected) {
          list =
          {
            "participant_name": this._players[i].player_name,
            "ref_id": this._players[i].player_id,
            "players": [
              {
                "user_id": this._players[i].player_id,
                "state": this._players[i].state,
                "club": this._players[i].club,
                "email": this._players[i].email,
                "name": this._players[i].player_name
              }
            ]
          }
          if (this._participantList.findIndex((x: any) => x.ref_id == this._players[i].player_id) == -1) {
            this._participantList.push(list);
          }
          const dfff = {
            "category_id": this._players[i].categories_list[k].categoryId,
            "participants": this._participantList
          }
          if (this._categoriesList.findIndex((x: any) => x.category_id == this._players[i].categories_list[k].categoryId) == -1) {
            this._categoriesList.push(dfff)
          } else {
            const index = this._categoriesList.findIndex((x: any) => x.category_id == this._players[i].categories_list[k].categoryId)
            if (this._categoriesList[index].participants.findIndex((x: any) => x.ref_id == this._participantList[0].ref_id) == -1) {
              this._categoriesList[index].participants.push(this._participantList[0])
            }
          }
        }

      }
    }
    for (let g = 0; g < this._categoriesList.length; g++) {
      const dd = {
        "category_id": this._categoriesList[g].category_id,
        "participants": this._participantList
      }
      this._categoriesListFinal
    }
    if (this._totalAmount > 0 && !Number.isNaN(this._totalAmount)) {
      const data = {
        "event_id": this._eventId,
        "participant_type_id": 1,
        "categories": this._categoriesList
      }
      this.eventService.registerParticipants(data).subscribe({
        next: (result: any) => {
          this._totalAmount = 0
          this._showLoader = false;
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000, });
          this.getPlayers();
          // window.open(result.body.payment_url);
          window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');
          // this.route.navigate([result.body.payment_url]);
          // this.route.navigate([result.body.payment_url]);
          // setTimeout(() => {
          //   this.route.navigate(['/home']);
          // }, 3000);
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
      this._showLoader = false;
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Information', detail: 'Total amount should be greater than zero.For this you must add some amount with all categories in Registration Form Section of Create Event.', life: 6000,
      });
      //some message here
    }
  }
  findTeams() {
    this._players = this._playersCopy.filter((item: any) => {
      return item.player_name.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
}
