import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';


@Component({
  selector: 'stupa-all-recents',
  templateUrl: './all-recents.component.html',
  styleUrls: ['./all-recents.component.scss'],
  providers: [MessageService],
})
export class AllRecentsComponent {
  _sellAllOngoing: any;
  _updateEventOnView:any;
  isSigned: boolean;
  _eventId: any;
  constructor(private messageService: MessageService,private encyptDecryptService: EncyptDecryptService, 
    private seeAllEvents:SeeAllEventsService,private router: Router){
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    
  }
  p:any;
  searchedString:any;
  _showLoader: boolean = false;

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    if(this.isSigned===true){
      this.seeAllEvents.sellAllOngoing('recent_events').subscribe({
        next: (data: any) => {
          this._sellAllOngoing = data.body;
        },
        error: (result: any) => {
        
        },
        complete: () => console.info('complete')
      })
    }
    else{
    this.seeAllEvents.sellAllOngoingAtHome('recent_events').subscribe({
      next: (data: any) => {
        this._sellAllOngoing = data.body;
      },
      error: (result: any) => {
      },
      complete: () => console.info('complete')
    })
  }
  }
  updateEvent(e:any){
    this._updateEventOnView = e;
    localStorage.setItem('event_data',JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);

  }
  _homeFlag: any=[];

  getEvents(){
    if (this._homeFlag === 'organize') {
      // this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('ongoing_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body;
          
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => console.info('complete')
      })
    }
    else {
      // this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('ongoing_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish:any) => publish.published===true); 
        },
        error: (result: any) => {
        },
        complete: () => console.info('complete')
      })
    }
  }
  searchMatches(){
    // this._showLoader = true;
    console.log(this.searchedString)
    this.searchedString=== undefined ? this.getEvents() : this.searchedString
    this.seeAllEvents.searchMatches(this.searchedString).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._sellAllOngoing = data.body;
      },
      error: (result: any) => {

      },
      complete: () => console.info('complete')
    })
  }
}
