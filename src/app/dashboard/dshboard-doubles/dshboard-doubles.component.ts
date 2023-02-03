import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { CreateDoublesComponent } from './create-doubles/create-doubles.component';

@Component({
  selector: 'stupa-dshboard-doubles',
  templateUrl: './dshboard-doubles.component.html',
  styleUrls: ['./dshboard-doubles.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class DshboardDoublesComponent implements OnInit {
  _playerArray: any = [
    { name: 'Player Name123', email: 'riodejaneiro@yopmail.com' },
    { name: 'Player Name123', email: 'riodejaneiro@yopmail.com' },
  ];
  _showcreateDoubles: boolean = false;
  _teams: any = [];
  _showLoader: boolean = false;
  mixedData: any = [];
  _searchTeams: any = '';
  _teamsCopy: any = [];
  _createTeam: boolean = false;
  @ViewChild(CreateDoublesComponent, { static: false }) childRef!: CreateDoublesComponent;
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.getTeams();
  }
  showDialog() {
    this._showcreateDoubles = true;
    this._createTeam = true;
    this.childRef.edit = false;
    this.childRef._mixedName = ''
  }
  showDialogEdit(){
    this._showcreateDoubles = true;
  }
  goBack() {
    this.router.navigate(['/profile-menu']);
  }
  closePopPup() {
    this._showcreateDoubles = false;
    this._createTeam = true;
    this.childRef._teamForm.reset();
    this.childRef._isSubmitDetails = false;
    this.childRef._maxPlayer = false;
    this.getTeams()
  }
  getTeams() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(3).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._teams = data.body;
        this._teamsCopy = data.body;
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
        this._showLoader = false;
      },
    });
  }
  showEditDialog(mixDoubleData: any) {
    this.mixedData = mixDoubleData;
    this._createTeam = false;
    this.childRef.edit = true;
    this.childRef._showName = false;
    this.childRef._mixedName = this.childRef._mixedName;
      this.childRef._teamId = this.mixedData.team_id;
      this.childRef._playersArray = this.mixedData.team_details;
      if (this.mixedData.abled) {
        this.childRef._teamForm.controls['abled'].setValue({ name: 'Abled' })
      } else {
        this.childRef._teamForm.controls['abled'].setValue({ name: 'Disabled' })
      }
      this.childRef._teamForm.controls['category'].setValue(this.mixedData.category)
    this.showDialogEdit();
  }
  deleteMixTeam(deletedId: any, index: any) {
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
              this._teams.splice(index, 1);
            },
            error: (result: any) => {
              this._showLoader = false;
            },
            complete: () => {},
          });
        } else {
        }
      })
      .catch(() => {});
  }

  teamsAfterSave(e: any) {
    this._teams = e;
  }
  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return item.name.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
}
