import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MessageService } from 'primeng/api';
import { CreateMixDouble } from './create-mix-double/create-mix-double.component';
@Component({
  selector: 'stupa-dshboard-mix-doubles',
  templateUrl: './dshboard-mix-doubles.component.html',
  styleUrls: ['./dshboard-mix-doubles.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class DshboardMixDoublesComponent {
  _showCreateTeam: boolean = false
  _teams: any = [];
  _showcreatemixDoubles: boolean = false;
  _showLoader: boolean = false;
  mixedData: any = [];
  _teamDetail: any=[];
  _searchTeams:any='';
  _teamsCopy: any=[];
  @ViewChild(CreateMixDouble, { static: false }) childRef!: CreateMixDouble;
  constructor(private dashboardService: DashboardService, private router: Router, private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.getMixDoubles();
  }
  showDialog() {
    this._showcreatemixDoubles = true;
    this.childRef.edit = false;
    this.childRef._mixedName = ''
  }
  showDialogEdit(){
    this._showcreatemixDoubles = true;
  }

  getMixDoubles() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(4).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._teams = data.body;
        this._teamsCopy = data.body;
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
      },
    });
  }
  goBack() {
    this.router.navigate(['/profile-menu']);
  }

  showMixDoublesData(e: any) {
    this._showcreatemixDoubles = false;
    this.childRef._teamForm.reset();
    this.childRef._isSubmitDetails = false;
    this.childRef._maxPlayer = false;
    this.childRef._mixedName = ''
    //this.childRef._playersArray = []
    this.getMixDoubles()
  }
  showEditDialog(mixDoubleData: any) {
    this.mixedData = mixDoubleData;
    this.childRef.edit = true;
    this.childRef._showName = false;
    this.childRef._mixedName = this.childRef._mixedName;
    
    //this.childRef._playersArray = this.mixedData.team_details;
    this.childRef._teamId = this.mixedData.team_id;
    this.childRef._playersArray = this.mixedData.team_details;
    if (this.mixedData.abled) {
      this.childRef._teamForm.controls['abled'].setValue({ name: 'Abled' })
    } else {
      this.childRef._teamForm.controls['abled'].setValue({ name: 'Disabled' })
    }
    this.childRef._teamForm.controls['category'].setValue(this.mixedData.category);
    this.showDialogEdit();

  }
  deleteMixTeam(deletedId: any,index:any) {
    
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this pair?'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader = true;
          this.dashboardService.deleteTeams(deletedId.team_id).subscribe({
            next: (data: any) => {
              this._showLoader = false;
              this._teams.splice(index,1)
              
              
            },
            error: (result: any) => {
              this._showLoader = false;
            },
            complete: () => {
            },
          });
        } else {
        }
      })
      .catch(() => { });

  }

  teamsAfterSave(e:any) {
    this._teams = e;
  }

  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase()));
    });
  }
  

}
