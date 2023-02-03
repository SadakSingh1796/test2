import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';

@Component({
  selector: 'stupa-all-ongoing',
  templateUrl: './all-ongoing.component.html',
  styleUrls: ['./all-ongoing.component.scss'],
  providers: [MessageService],
})
export class AllOngoingComponent implements OnInit {
  _sellAllOngoing: any;
  _updateEventOnView: any;
  isSigned: boolean=false;
  _eventId: any;
  _showLoader: boolean = false;
  _homeFlag: any=[];
  constructor(
    private messageService: MessageService,
    private seeAllEvents: SeeAllEventsService,
    private router: Router,
    private encyptDecryptService: EncyptDecryptService,
    private route: ActivatedRoute
  ) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    
  }
  p: any;
  searchedString:any;

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    localStorage.removeItem('event_data');
    
    this.route.paramMap.subscribe(params => {
      this._homeFlag= params.get('id');
  });
  this.getEvents();
    
  }

  getEvents(){
    if (this._homeFlag === 'organize') {
      this._showLoader = true;
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
  updateEvent(e: any) {
    this._updateEventOnView = e;
    localStorage.setItem('event_data', JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);

    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);

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
