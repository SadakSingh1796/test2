import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-arrange-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './arrange-dialog.component.html',
  styleUrls: ['./arrange-dialog.component.scss']
})
export class ArrangeDialogComponent {
  @Input() _teamMatchFullDetails: any = [];
  @Input() _teamBPlayers: any = [];
  @Input() _teamAPlayers: any = [];
  @Input() _teamAPlayersCopy: any = [];
  @Input() _teamBPlayersCopy: any = [];
  _fieldList: any = [
    {
      "isSingle": true,
      "player_teamA": '',
      "player_teamB": '',
      "dropValuePlayerA": [],
      "dropValuePlayerB": []
    }
  ];
  _eventId: any = 0;
  _showLoader: boolean = false
  _matchList: any = [];
  @Input() _parent_match_id: any = '';
  @Input() _teamA_participant_id: any = '';
  @Input() _teamB_participant_id: any = '';
  @Input() _currentCategoryId: any;
  @Output() isTeamMatchCreated = new EventEmitter<any>();
  @Input() _isEditForScoreUpdate: boolean = false;
  @Input() _createdMatchList: any = [];
  _selectedPlayerA: any = [];
  _selectedPlayerB: any = [];
  _selectedPlayerAFrmD: any = [];
  _selectedPlayerBFrmD: any = [];
  _playerBDummyList: any = [];
  _showError: boolean = false;
  _massage: any;
  constructor(private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private messageService: MessageService) {
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this._fieldList = [
      {
        "isSingle": true,
        "player_teamA": '',
        "player_teamB": '',
        "dropValuePlayerA": [],
        "dropValuePlayerB": []
      }
    ];
  }
  ngOnChanges(changes: SimpleChanges) {
    this._fieldList = [
      {
        "isSingle": true,
        "player_teamA": '',
        "player_teamB": '',
        "dropValuePlayerA": [],
        "dropValuePlayerB": []
      }
    ];
  }
  addField(isSingle: any) {
    // if (this._fieldList.length < 5) 
    if (this._fieldList.length < 3) {
      // if (this._fieldList.length < 3) {
      //   this._fieldList.push({
      //     "isSingle": true,
      //     "player_teamA": '',
      //     "player_teamB": '',
      //     "dropValuePlayerA": [],
      //     "dropValuePlayerB": []
      //   })

      // } else {
      //   if (isSingle) {
      //     this._fieldList.push({
      //       "isSingle": true,
      //       "player_teamA": '',
      //       "player_teamB": '',
      //       "dropValuePlayerA": [],
      //       "dropValuePlayerB": []
      //     })
      //   } else {
      //     this._fieldList.push({
      //       "isSingle": isSingle,
      //       "player_teamA": '',
      //       "player_teamB": '',
      //       "dropValuePlayerAOne": [],
      //       "dropValuePlayerBOne": [],
      //       "dropValuePlayerATwo": [],
      //       "dropValuePlayerBTwo": []
      //     })
      //   }

      // }
      if (isSingle) {
        this._fieldList.push({
          "isSingle": true,
          "player_teamA": '',
          "player_teamB": '',
          "dropValuePlayerA": [],
          "dropValuePlayerB": []
        })
      } else {
        this._fieldList.push({
          "isSingle": isSingle,
          "player_teamA": '',
          "player_teamB": '',
          "dropValuePlayerAOne": [],
          "dropValuePlayerBOne": [],
          "dropValuePlayerATwo": [],
          "dropValuePlayerBTwo": []
        })
      }

    }
  }
  createTeamMatches() {
    this._matchList = [];
    //   if (this._fieldList.length == 3 || this._fieldList.length == 5)  
    if (this._fieldList.length == 3) {
      for (let i = 0; i < this._fieldList.length; i++) {
        if (this._fieldList[i].isSingle) {
          const data = {
            "player_teamA": this._fieldList[i].dropValuePlayerA.name,
            "player_teamB": this._fieldList[i].dropValuePlayerB.name
          }
          if (this._fieldList[i].dropValuePlayerA.name !== undefined && this._fieldList[i].dropValuePlayerB.name !== undefined) {
            this._showError = false;
            this._matchList.push(data);
          } else {
            this._massage = "Kindly Select Players In Row " + (i + 1);
            this._showError = true
            break;
          }
        } else {
          if (this._fieldList[i].dropValuePlayerAOne.name !== undefined
            && this._fieldList[i].dropValuePlayerBOne.name !== undefined
            && this._fieldList[i].dropValuePlayerATwo.name !== undefined
            && this._fieldList[i].dropValuePlayerBTwo.name !== undefined) {
            this._showError = false;
            if ((this._fieldList[i].dropValuePlayerAOne.name == this._fieldList[i].dropValuePlayerBOne.name) || (this._fieldList[i].dropValuePlayerATwo.name == this._fieldList[i].dropValuePlayerBTwo.name)) {
              this._massage = "Same Players In Row " + (i + 1);
              this._showError = true
              break;
            } else {
              const data = {
                "player_teamA": this._fieldList[i].dropValuePlayerAOne.name + '/' + this._fieldList[i].dropValuePlayerBOne.name,
                "player_teamB": this._fieldList[i].dropValuePlayerATwo.name + '/' + this._fieldList[i].dropValuePlayerBTwo.name
              }
              this._matchList.push(data);
            }
          } else {
            this._massage = "Kindly Select Players In Row " + (i + 1);
            this._showError = true
            break;
          }
        }
      }
      if (!this._showError) {
        const body = {
          "event_id": this._eventId,
          "category_id": this._currentCategoryId,
          "parent_match_id": this._parent_match_id,
          "teamA_participant_id": this._teamA_participant_id,
          "teamB_participant_id": this._teamB_participant_id,
          "matches": this._matchList
        }
        this.eventsService.createTeamMatches(body).subscribe({
          next: (result: any) => {
            this._showLoader = false;

            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
            this.isTeamMatchCreated.emit(true);
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
    } else {
      this._showError = true
      this._massage = 'Minimum 3 And Maximum 5 Team Matches Accepted'
    }
  }
  deleteRow(index: any) {
    if (this._fieldList.length > 1) {
      if (this._fieldList[index].isSingle) {
        if (this._fieldList[index].player_teamA !== '') {
          this._teamAPlayers.push(this._selectedPlayerA.filter((x: any) => x.name == this._fieldList[index].player_teamA)[0])
        }
        if (this._fieldList[index].player_teamB !== '') {
          this._teamBPlayers.push(this._selectedPlayerB.filter((x: any) => x.name == this._fieldList[index].player_teamB)[0])
        }
      } else {
        if (this._fieldList[index].player_teamA !== '') {
          if (this._fieldList[index].player_teamA.split('/')[0] !== '') {
            this._teamAPlayers.push(this._selectedPlayerAFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamA.split('/')[0])[0])
          }
          if (this._fieldList[index].player_teamA.split('/')[1] !== '') {
            this._teamBPlayers.push(this._selectedPlayerBFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamA.split('/')[1])[0])
          }
        }
        if (this._fieldList[index].player_teamB !== '') {
          if (this._fieldList[index].player_teamB.split('/')[0] !== '') {
            this._teamAPlayers.push(this._selectedPlayerAFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamB.split('/')[0])[0])
          }
          if (this._fieldList[index].player_teamB.split('/')[1] !== '') {
            this._teamBPlayers.push(this._selectedPlayerBFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamB.split('/')[1])[0])
          }
        }
      }
      this._fieldList.splice(index, 1)
    }
  }
  selectPlayerA(data: any, index: any) {
    // if (this._fieldList[index].isSingle) {
    //   this._selectedPlayerA.push(data.value);
    //   this._teamAPlayers.splice(this._teamAPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamA = data.value.name
    // }
  }
  selectPlayerB(data: any, index: any) {
    // if (this._fieldList[index].isSingle) {
    //   this._selectedPlayerB.push(data.value);
    //   this._teamBPlayers.splice(this._teamBPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamB = data.value.name
    // }
  }
  selectDPlayerA(data: any, index: any, fromTeam: any) {
    // if (this._selectedPlayerAFrmD.findIndex((x: any) => x.user_id == data.value.user_id) == -1) {
    //   this._selectedPlayerAFrmD.push(data.value);
    // }
    // if (fromTeam == 'A') {
    //   this._teamAPlayers.splice(this._teamAPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamA = data.value.name
    // } else {
    //   this._teamAPlayers.splice(this._teamAPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamB = data.value.name
    // }
  }
  selectDPlayerB(data: any, index: any, fromTeam: any) {
    // if (this._selectedPlayerBFrmD.findIndex((x: any) => x.user_id == data.value.user_id) == -1) {
    //   this._selectedPlayerBFrmD.push(data.value);
    // }
    // if (fromTeam == 'A') {
    //   this._teamBPlayers.splice(this._teamBPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamA = this._fieldList[index].player_teamA + '/' + data.value.name
    // } else {
    //   this._teamBPlayers.splice(this._teamBPlayers.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    //   this._fieldList[index].player_teamB = this._fieldList[index].player_teamB + '/' + data.value.name
    // }
  }
}
