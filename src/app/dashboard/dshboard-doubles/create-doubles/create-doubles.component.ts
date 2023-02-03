import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-create-doubles',
  templateUrl: './create-doubles.component.html',
  styleUrls: ['./create-doubles.component.scss'],
  providers: [MessageService]
})
export class CreateDoublesComponent {
  @Output() closePopPup = new EventEmitter<any>();
  _abled: any = [{ name: 'Abled' }, { name: 'Disabled' }];
  _gender: any = [{ name: 'Male' }, { name: 'Female' }, , { name: 'Other' }];
  _editFeild: boolean = true;
  _heading: any = 'Team Name sample 123';
  _playersArray: any = [];
  _selectedPlayer: any;
  _showDrpdwn: boolean = false;
  _playerList: any = [];
  _masterCategoriesList: any = [];
  event_id: any
  _isSaveTeam: boolean = false;
  _teamForm!: FormGroup;
  _players: any = [];
  _showLoader: boolean = false;
  _maxPlayer: boolean = false;
  _teamId: any;
  _getTeams: any = [];
  _showName: boolean = false;

  @Output() newMixedTeams = new EventEmitter<any>();
  @Input() mixedData: any = [];
  _removed: any = [];
  _isSubmitDetails: boolean = false;
  edit: boolean = false;
  _mixDoublesName: any = [];
  _mixedName: any;
  selectedValue: any = null;
  _mixedName2: any;
  constructor(private profileMenuService: ProfileMenuService, private eventService: EventsService, private messageService: MessageService, private encyptDecryptService: EncyptDecryptService,
    private formBuilder: FormBuilder, private dashboardService: DashboardService,) {
    this._teamForm = this.formBuilder.group({
      abled: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      teamName: new FormControl(''),
    });
    this.getMasterCategories();
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    console.log(this.event_id)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mixedData'].currentValue != '') {
      this.edit = true;
      this._mixedName = this._mixedName;
      this._teamId = this.mixedData.team_id;
      this._playersArray = this.mixedData.team_details;
      if (this.mixedData.abled) {
        this._teamForm.controls['abled'].setValue({ name: 'Abled' })
      } else {
        this._teamForm.controls['abled'].setValue({ name: 'Disabled' })
      }
      this._teamForm.controls['category'].setValue(this.mixedData.category)
      //this._teamForm.controls['teamName'].setValue(this.mixedData.name);
    }
  }
  closePopUp() {
    this._players = [];
    this._playersArray = [];
    this.getMixDoubles();
    this.closePopPup.emit();
    this.reset();

  }
  editFeild(edit: boolean) {
    this._editFeild = edit;
    if (this._heading == '') {
      this._heading = 'Team Name sample 123';
    }
  }
  showDropdown() {
    this._showDrpdwn = true
  }
  getPlayersinCategory(data:any){
    this.getPlayers(data.value)
    }

  getPlayers(category_id:any) {
    console.log(category_id)
    this._players=[];
    this._playersArray=[];
    this._playerList=[];
    this.eventService.getPlayers(null).subscribe({
      next: (data: any) => {
        this._playerList = data.body.filter((p:any)=>p.open_categories.includes(category_id));
      },
      complete: () => { },
    });
  }
  getMasterCategories() {
    this.profileMenuService.getMasterCategories().subscribe({
      next: (data: any) => {
        this._masterCategoriesList = data.body.filter((x: any) => x.participant_type_id === 3);
      },
      error: (data: any) => {

      },
      complete: () => {

      },
    })
  }
  saveTeam() {
    if (this.mixedData.length == 0) {
      this.createTeam();
    }
    else {
      this.updateTeam();
    }
  }
  addPlayer(event: any) {
    if (this._playersArray.length < 2) {
      if (this._playersArray.findIndex((x: any) => x.user_id === event.value.user_id) == -1) {
        this._playersArray.push(event.value);
        this._players.push(event.value.user_id);
        this.selectedValue = event.value.name
        if (this._playersArray.length === 2) {
          this._mixDoublesName = this._playersArray.map((n: any) => n.name);
          const player1 = this._mixDoublesName[0].toString().split(" ")[0];
          const player2 = this._mixDoublesName[1].toString().split(" ")[0];
          this._mixedName = player1 + "/" + player2;
          this._mixedName2 = player2 + "/" + player1;
        }
      }
      else {
        //show toast: player already added
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Player Already added',
          life: 3000,
        });
      }
    }
    else {
      this._maxPlayer = true;
    }

  }
  clearDropdown(event: any) {
    this.selectedValue = null;
  }
  removePlayer(event: any, index: number) {
    this._maxPlayer = false;
    this._playersArray.splice(index, 1);
    this._players.splice(index, 1);
    this._removed.push(event.user_id)

  }
  getMixDoubles() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(3).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        for (let i = 0; i < data.body.length; i++) {
          if (data.body[i].category.participant_type_id === 3) {
            this._getTeams.push(data.body[i]);
            this.newMixedTeams.emit(this._getTeams)
          }
        }
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
      },
    });
  }
  createTeam() {
    if (this._teamForm.valid && this._playersArray.length === 2) {
      this._isSubmitDetails = false;
      const data = {
        "name": this._mixedName,
        "category_id": this._teamForm.controls['category'].value.category_id,
        "members": this._players,
        "abled": this._teamForm.controls['abled'].value.name === 'Abled' ? true : false,
        "participant_type_id": 3
      }
      this.eventService.createTeam(data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Doubles pair created successfully',
            life: 1000,
          });

          setTimeout(() => {
          this._players = [];
          this._playersArray = [];
          this._showLoader = false;
          this.closePopPup.emit();
          this.reset();
          //this.getMixDoubles();
          this._showName = true;
            }, 2000);
        },
        error: (result) => {
          this._players = [];
          this._playersArray = [];
          this._showLoader = false;
        },
        complete: () => {

        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  updateTeam() {
    if (this._teamForm.valid && this._playersArray.length === 2) {
      const data = {
        "name": this._mixedName,
        "team_id": this._teamId,
        "added": this._players,
        "removed": this._removed
      }
      this.dashboardService.updateTeam(data).subscribe({
        next: (data: any) => {
          //this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Doubles pair updated successfully',
            life: 3000,
          });
          setTimeout(() => {
          this.closePopPup.emit();
          this.reset()
          //this.getMixDoubles();
          this._showName = true;
              }, 2000);
          
          


        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => {

        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  duplicateTeam() {
    if(this._teamForm.valid){
    const teamName = this._mixedName;
    this.dashboardService.duplicateTeamName(teamName).subscribe({
      next: (data: any) => {
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: 'Pair Exists', life: 2000,
        });
        this._teamForm.controls['teamName'].setValue('');
      },
      error: (result: any) => {
        this.saveTeam()
      },
      complete: () => {
      },
    });
  }
  else{
    this._isSubmitDetails = true;
  }
  }
  reset() {
    this._teamForm.reset();
    this._playersArray = [];
    //this._mixedName=''
  }
}
