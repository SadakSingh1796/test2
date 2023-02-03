import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-dshboard-single',
  templateUrl: './dshboard-single.component.html',
  styleUrls: ['./dshboard-single.component.scss']
})
export class DshboardSingleComponent implements OnInit {
  _playersList: any = [];
  _playersListCopy: any = [];
  _totalPendingUser: number = 10;
  _pending: any = '';
  event_id: number = 0
  _showLoader: boolean = false;
  _searchByPlayerName: any = '';
  showDialog: boolean = false;
  _fieldData: any = [];
  constructor(private router: Router,  private eventService: EventsService,
    private encyptDecryptService: EncyptDecryptService
    // private messageService:MessageService
  ) { }
  ngOnInit() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getPlayers();
  }
  goBack() {
    this.router.navigate(['/profile-menu']);
  }
  getPlayers() {
    this._showLoader = true;
   this._showLoader=true;
    this.eventService.getPlayers(this.event_id).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._playersList = data.body;
        this._playersListCopy = data.body;

      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {
        this._showLoader = false;

      },
    });
  }

  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
  paginate(event: any, type: string) {
    // this._currenPendingPage = event.page + 1;
    this.getPlayers();
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }
  search() { }
  removePlayer() {
  }
  searchPlayer() {
    this._playersList = this._playersListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.state
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  _showDetails(data:any){
    console.log(data)
    this._fieldData = data;
    this.showDialog = true;
  }
  closePopUp() {
    this.showDialog = false;
  }
}
