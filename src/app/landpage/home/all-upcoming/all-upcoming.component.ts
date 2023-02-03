import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
@Component({
  selector: 'stupa-all-upcoming',
  templateUrl: './all-upcoming.component.html',
  styleUrls: ['./all-upcoming.component.scss'],
  providers: [MessageService],
})
export class AllUpcomingComponent {
  _sellAllOngoing: any;
  _updateEventOnView: any;
  isSigned: boolean;
  event: any
  _showLoader: boolean = false;
  searchedString: any;
  _homeFlag: any = "";
  constructor(private encyptDecryptService: EncyptDecryptService,
    private seeAllEvents: SeeAllEventsService, private router: Router,private route:ActivatedRoute) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  p: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this._homeFlag= params.get('id');
  });
  this.getEvents();
  }

  getEvents() {
    if (this._homeFlag === true) {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('upcoming_events').subscribe({
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
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('upcoming_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish:any) => publish.published==true); 

        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => {

        }
      })
    }
  }
  updateEvent(e: any) {
    this._showLoader = true;
    this._updateEventOnView = e;
    localStorage.setItem('event_data', JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);
    this._showLoader = false;

  }
  searchMatches() {
    // this._showLoader = true;
    this.seeAllEvents.searchMatches(this.searchedString).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._sellAllOngoing = data.body;
      },
      error: (result: any) => {

      },
      complete: () => {

      }
    })
  }
}
