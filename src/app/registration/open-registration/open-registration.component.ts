import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';

@Component({
  selector: 'stupa-open-registration',
  templateUrl: './open-registration.component.html',
  styleUrls: ['./open-registration.component.scss'],
  providers: [MessageService],
})
export class OpenRegistrationComponent {
  _showLoader: boolean = false;

  _sellAllOngoing: any;
  _updateEventOnView: any;
  isSigned: boolean;
  _isRegister:boolean = false;
  event_id:number = 0;
  searchedString:any;
  _homeFlag: any = [];
  constructor(private messageService: MessageService, private route:ActivatedRoute,
    private seeAllEvents: SeeAllEventsService, private router: Router, private encyptDecryptService: EncyptDecryptService) {
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

  ngOnInit(): void {
    localStorage.removeItem('event_data');
    this.route.paramMap.subscribe(params => {
      this._homeFlag= params.get('id');
      console.log(this._homeFlag)
  });
  this.getEvents();
  }

  getEvents(){
    if (this._homeFlag === 'organize') {
      // this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('register_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body; 
          
        },
        error: (result: any) => {
          this._showLoader = false;
        },
        complete: () => {

        }
      })
    }
    else {
      // this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('register_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish:any) => publish.published==true); 
          
        },
        error: (result: any) => {
        },
        complete: () => {

        }
      })
    }
  }
  updateEvent(e: any) {
    this._updateEventOnView = e;
    localStorage.setItem('event_data',JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);

  }
  navigateToRegisteration(data: any) {
    //routerLink="/registration/register"
    this._updateEventOnView = data;
    const dd = this.encyptDecryptService.encryptUsingAES256(data.event_id.toString());
    localStorage.setItem('event_id', dd);
    this.event_id = data.event_id;
    this._isRegister=true;
    const eventName = this.encyptDecryptService.encryptUsingAES256(data.event_name);
    localStorage.setItem('ev_nm', eventName);
    // this.router.navigate(['/registration/register']);
  }
  searchMatches(){
    // this._showLoader = true;
    //this.searchedString == undefined ? '' : this.searchedString
    
    if(this.searchedString===undefined || this.searchedString==="" ){
      this.getEvents();
    }
    else{
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
}
