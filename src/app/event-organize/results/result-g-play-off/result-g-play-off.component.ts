import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { PrimeNGConfig, OverlayOptions } from 'primeng/api';
@Component({
  selector: 'stupa-result-g-play-off',
  templateUrl: './result-g-play-off.component.html',
  styleUrls: ['./result-g-play-off.component.scss'],
  providers: [MessageService],
})
export class ResultGPlayOffComponent implements OnInit {
  @Input() __getRadioValues: any;
  show = false;
  hover = false;
  hover2 = false;
  showDiv = false;
  _showLoader: boolean = false;
  _eventId: any;
  _matchDetailsList: any = [];
  _matchDetailsListCopy:any=[];
  _searchTeams: any = '';
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId:any
  _matchesArray: any = [];
  _showAddPlayer: boolean = false;
  _openRecentlyDeleted: boolean = false;
  _showHistoryDialog: boolean = false;
  _date = new Date();
  _days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  _playerAScore: number = 0;
  _playerBScore: number = 0;
  overlayVisible: boolean = false;
  __scoreArray = [11, 5, 11, 13, 15, 9, 4];
  // __Team_screen_result = [
  //   {
  //     id: 1,
  //     name: 'govind singh ',
  //     name2: 'Divyanshu ',
  //     __scoreArray: [11, 5, 11, 13, 15, 9, 4],
  //   },
  //   {
  //     id: 2,
  //     name: 'Divyanshu  ',
  //     name2: 'govind singh ',
  //     __scoreArray: [4, 11, 13, 15, 17, 11, 11],
  //   },
  //   {
  //     id: 3,
  //     name: 'Divyanshu  ',
  //     name2: 'govind singh ',
  //     __scoreArray: [4, 11, 13, 15, 17, 11, 11],
  //   },
  //   {
  //     id: 4,
  //     name: 'Govind Singh  ',
  //     name2: 'Divyanshu ',
  //     __scoreArray: [4, 11, 13, 15, 17, 11, 11],
  //   },
  //   {
  //     id: 5,
  //     name: 'Divyanshu  ',
  //     name2: 'govind singh ',
  //     __scoreArray: [4, 11, 13, 15, 17, 11, 11],
  //   },
  //   // { id: 6, name: 'Govind  ' , name2: 'Divyanshu ', __scoreArray: [4, 11, 13, 15, 17, 11, 11] },
  //   // { id: 7, name: 'Govind  ' , name2: 'Divyanshu ', __scoreArray: [4, 11, 13, 15, 17, 11, 11] },
  // ];
  _playerResult = [
    {
      date: new Date(),
      round: 'Semi Finals',
      isLive: true,
      playerAName: 'Govind Singh',
      playerBName: 'Divyanshu Lingwal',
      avatar: 'pi pi-user',
      playerASetScore: [11, 12, 6, 7, 4, 9, 10],
      playerBSetScore: [0, 5, 11, 11, 11, 11, 8],
      playerAScore: 6,
      playerBScore: 5,
    },
    {
      date: new Date(),
      round: 'Quater Finals',
      isLive: false,
      playerAName: 'Govind Singh',
      playerBName: 'Divyanshu Lingwal',
      avatar: 'pi pi-user',
      playerASetScore: [11, 12, 6, 7, 4, 9, 10],
      playerBSetScore: [0, 5, 11, 11, 11, 11, 8],
      playerAScore: 3,
      playerBScore: 9,
    },
    {
      date: new Date(),
      round: 'Pre Quater',
      isLive: true,
      playerAName: 'Govind Singh',
      playerBName: 'Divyanshu Lingwal',
      avatar: 'pi pi-user',
      playerASetScore: [11, 12, 6, 7, 4, 9, 10],
      playerBSetScore: [0, 5, 11, 11, 11, 11, 8],
      playerAScore: 1,
      playerBScore: 9,
    },
  ];
  displayBasic: boolean = false;
  displayBasic2: boolean = false;
  isClicked = false;
  _showValue: boolean = false;
  _showDialog: boolean = false;
  _opponentScore: any;
  _showTeam: boolean=false;
  _newTeamList: any=false;
  _showPlayerData: boolean = false;
  _name: any;
  _showPlayer: any=[];
  _showName: any;
  _team1: any='';
  _team2: any='';
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private primengConfig: PrimeNGConfig
  ) {}
  ngOnInit(): void {
    this._currentCategoryId
    this._currentParticipantId
    console.log(this._currentParticipantId)
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGroupResults();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._currentCategoryId
    this._currentParticipantId
    console.log(this._currentParticipantId)
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGroupResults();
  }

  openAddPlayer() {
    this._showAddPlayer = true;
    this._openRecentlyDeleted = false;
  }
  openRecentlyDeleted() {
    this._openRecentlyDeleted = true;
    this._showHistoryDialog = false;
    this._showAddPlayer = false;
  }
  removeTeamScreen() {
    alert('clicked');
  }
  showTeamResult() {
    this.isClicked = !this.isClicked;
  }
  showBasicDialog() {
    this.displayBasic2 = true;
  }
  show_result() {
    alert('clicked');
  }
  swaping(event: { type: string }) {
    if (event.type === 'mouseover') {
      // alert("mouse hover hogya bhai");
      this.displayBasic = true;
    } else if (event.type === 'mouseleave') {
      // alert("mouse leave krgya bhai");
      this.displayBasic = true;
      // this.displayBasic = false;
    }
  }
  getGroupResults() {
    this._matchDetailsList = [];
    this._showLoader = true;
    this.eventsService
      .getGroupResults(
        this._eventId,
        this._currentCategoryId
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          for (let i = 0; i < result.body.length; i++) {
            for (let j = 0; j < result.body[i].length; j++) {
              const dd = {
                position: 0
              }
              result.body[i][j].data.splice(j, 0, dd);
            }
          }
          this._matchDetailsList = result.body;
          this._matchDetailsListCopy = result.body

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
  sortData() {
  }
  ShowHoverEffect(event: any) {
    if (event.type === 'mouseover') {
      // alert("mouse hover hogya bhai");
      this.hover = true;
    } else if (event.type === 'mouseleave') {
      this.hover = false;
    }
    // this.hover = true ;
  }
  ShowHoverEffect2(event: any,data:any) {
         if (event.type === 'mouseover') {
      // alert("mouse hover hogya bhai");
      this.hover2 = true;
      console.log(data)
    } else if (event.type === 'mouseleave') {
      // alert("mouse leave krgya bhai");
      this.hover2 = false;
    }
    // this.hover = true ;
  }
  RemoveTeamScreen() {
    this._showTeam = false;
    this._matchesArray =[]
  }
  // ShowTeamScreen(data:any) {
  //   this.getTeamMatches(data);
  //   //this.showDiv = true;
  // }
  showScore(data:any){
    console.log(data)
  }
  closePopUp(){
    this._showDialog = false;
    this._matchesArray =[];
    this._showPlayerData = false
  }
  toggle(showScore:boolean,data:any,index:any,name:any,team:any) {
    if( this._currentParticipantId===2){
      console.log(name)
      console.log(team)
      this.getTeamMatches(data.match_id, index);
      this._team1= name.participant_name;
      this._team2 = name.data[1].opponent_name
    }
    
    else{
      this._showPlayerData = true
      // this._showPlayerData = !this._showPlayerData;
      this._showPlayer = data;
      this._showName = name.participant_name;

    }
  }
  searchGroups(){
    if(this._searchTeams>0){
    this._matchDetailsList = this._matchDetailsListCopy.filter((val:any, i:any) => i == this._searchTeams-1);
    }
    else{
      this._matchDetailsList = this._matchDetailsListCopy;
    }
  }
  getTeamMatches(match:any,index1:any) {
      this.eventsService.getTeamMatches(this._eventId,match).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          console.log(index1)
          //this._newTeamList = result.body.filter((element:any, index:any) => index === 0)
          this._newTeamList = result.body.map((md:any)=>md.match_details).flat();
          console.log(this._newTeamList)
          for (let i = 0; i < this._newTeamList.length; i += 2) {
            const matches = {
              participant_id_A: this._newTeamList[i],
              participant_id_B: this._newTeamList[i + 1],
            };
            this._matchesArray.push(matches);
            console.log(this._matchesArray);
            this._showTeam = true;
            this.overlayVisible = true;
            
           
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
