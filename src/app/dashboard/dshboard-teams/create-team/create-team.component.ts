import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  providers: [MessageService]
})
export class CreateTeamComponent implements OnInit, OnChanges {
  _abled: any = [{ name: 'Abled' }, { name: 'Disabled' }];
  _gender: any = [{ name: 'Male' }, { name: 'Female' }, , { name: 'Other' }];
  _editFeild: boolean = true;
  _heading: any = 'Team Name sample 123';
  _playersArray: any=[];
  _selectedPlayer: any;
  _showDrpdwn: boolean = false
  @Output() closePopPup = new EventEmitter<any>();
  _playerList: any = [];
  _masterCategoriesList: any = [];
  event_id:any
  _isSaveTeam: boolean = false;
  _showLoader: boolean = false;
  _players: any = [];
  _teamForm!: FormGroup;
  _showEdit:boolean = false
  @Output() newMixedTeams = new EventEmitter<any>();
  @Input() mixedData: any = [];
  _teamId: any;
  _removed: any = [];
  _getTeams: any = [];
  _isSubmitDetails: boolean = false;
  edit: boolean = false;
  selectedValue :any = null;
  _playerInCategories: any=[];
  constructor(private eventService: EventsService, private profileMenuService: ProfileMenuService, private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService, private formBuilder: FormBuilder, private dashboardService: DashboardService,) {
    this.getMasterCategories();
    this._teamForm = this.formBuilder.group({
      abled: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      teamName: new FormControl('', Validators.compose([Validators.required])),
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mixedData'].currentValue != '') {
      this.edit = true
      this._teamId = this.mixedData.team_id;
      this._playersArray = this.mixedData.team_details;
      if (this.mixedData.abled) {
        this._teamForm.controls['abled'].setValue({ name: 'Abled' })
      } else {
        this._teamForm.controls['abled'].setValue({ name: 'Disabled' })
      }
      this._teamForm.controls['category'].setValue(this.mixedData.category)
      this._teamForm.controls['teamName'].setValue(this.mixedData.name)
      this._masterCategoriesList
    }
    
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
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

  closePopUp() {
    this._players=[];
    this._playersArray=[];
    this.getMixDoubles();
    this.closePopPup.emit();
    this.reset();
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
        this._masterCategoriesList = data.body.filter((x: any) => x.participant_type_id === 2);
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
      this._showEdit= true;
      this.updateTeam();
    }
  }
  createTeam() {
    if (this._teamForm.valid && this._playersArray.length >= 3) {
      this._isSubmitDetails = false;
      const data = {
        "name": this._teamForm.controls['teamName'].value,
        "category_id": this._teamForm.controls['category'].value.category_id,
        "members": this._players,
        "abled": this._teamForm.controls['abled'].value.name === 'Abled' ? true : false,
        "participant_type_id": 2
      }
      this.eventService.createTeam(data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: 'Team Created Successfully', life: 1000,
          });

          setTimeout(() => {
          this._players=[];
          this._playersArray=[];
          this.closePopPup.emit();
          this.reset();
          }, 2000);
          
          //this.getMixDoubles();
          

        },
        error: (result) => {
          this._players = [];
          this._playersArray = [];
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.body.msg,
            life: 3000,
          });
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
    if (this._teamForm.valid && this._playersArray.length >= 3) {
      const data = {
        "team_id": this._teamId,
        "name": this._teamForm.controls['teamName'].value,
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
            detail: 'Team Updated Successfully',
            life: 1000,
          });
          setTimeout(() => {
            this.closePopPup.emit();
            this.reset()
            }, 2000);
          
          //this.getMixDoubles();
          

        },
        error: (result) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.body.msg,
            life: 3000,
          });
        },
        complete: () => {

        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  getMixDoubles() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(2).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        for (let i = 0; i < data.body.length; i++) {
          if (data.body[i].category.participant_type_id === 2) {
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
  addPlayer(event: any) {
    const players=[];
    this._isSubmitDetails = false;
      if (this._playersArray.findIndex((x: any) => x.user_id === event.value.user_id) == -1) {
      this._playersArray.push(event.value);
    //  players.push(event.value.user_id);
      this._players.push(event.value.user_id)
      this.selectedValue = event.value.name
    
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
 
  removePlayer(event: any, index: number) {
    this._playersArray.splice(index, 1);
    this._players.splice(index, 1);
    this._removed.push(event.user_id);

  }
  duplicateTeam() {
    if(this._teamForm.valid){
    const teamName = this._teamForm.controls['teamName'].value;
    this.dashboardService.duplicateTeamName(teamName).subscribe({
      next: (data: any) => {
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: 'Team Name Exists', life: 2000,
        });
        this._teamForm.controls['teamName'].setValue('');
      },
      error: (result: any) => {
        this.createTeam();
      },
      complete: () => {
      },
    });
  }
  else{
    this._isSubmitDetails = true;
  }
  }

  // ngOnDestroy() {
  //   this.reset();
  // }
  reset(){
    this._teamForm.reset();
    this._playersArray = [];
  }
  clearDropdown(event:any){
    this.selectedValue = null;
    }

    
}
