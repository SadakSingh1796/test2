import { getLocaleMonthNames } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { CreateTeamComponent } from './create-team/create-team.component';
@Component({
  selector: 'stupa-dshboard-teams',
  templateUrl: './dshboard-teams.component.html',
  styleUrls: ['./dshboard-teams.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class DshboardTeamsComponent {
  _showCreateTeam: boolean = false
  _teams: any = [];
  _playerArray: any = [];
  teamdata: any = [];
  _showLoader = false;
  mixedData: any = [];
  _searchTeams: any = '';
  _teamsCopy: any = [];
  @ViewChild(CreateTeamComponent, { static: false }) childRef!: CreateTeamComponent;
  constructor(private dashboardService: DashboardService, private router: Router, private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.getTeams();
    
  }
  showDialog() {
    this._showCreateTeam = true;
    this.childRef.edit = false;
  }
  showDialogEdit(){
    this._showCreateTeam = true;
  }
  closePopPup() {
    this._showCreateTeam = false;
    this.childRef._isSubmitDetails = false;
    this.childRef._teamForm.controls['teamName'].setValue('')
    //this.childRef._playersArray = this.childRef.mixedData.team_details
    this.getTeams();
    //this.childRef._teamForm.reset();
    
    
  }
  getTeams() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(2).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._teams = data.body;
        this._teamsCopy = data.body;
        //this.childRef._playersArray= data.body.team_details
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
  editTeam(mixDoubleData: any) {
    this.childRef.edit = true;
    this.mixedData = mixDoubleData;
      this.childRef._teamId = this.mixedData.team_id;
      this.childRef._playersArray = this.mixedData.team_details;
      if (this.mixedData.abled) {
        this.childRef._teamForm.controls['abled'].setValue({ name: 'Abled' })
      } else {
        this.childRef._teamForm.controls['abled'].setValue({ name: 'Disabled' })
      }
      this.childRef._teamForm.controls['category'].setValue(this.mixedData.category)
      this.childRef._teamForm.controls['teamName'].setValue(this.mixedData.name)
      this.childRef._masterCategoriesList;
      this.showDialogEdit();
  }
  teamsAfterSave(e: any) {
    this._teams = e;
  }
  deleteMixTeam(deletedId: any, index: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this team?'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader = true;
          this.dashboardService.deleteTeams(deletedId.team_id).subscribe({
            next: (data: any) => {
              this._showLoader = false;
              this._teams.splice(index, 1)


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
  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(this._searchTeams.toLowerCase()));
    });
  }

}
