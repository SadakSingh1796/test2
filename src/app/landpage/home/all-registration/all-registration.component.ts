import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';


@Component({
  selector: 'stupa-all-registration',
  templateUrl: './all-registration.component.html',
  styleUrls: ['./all-registration.component.scss'],
  providers: [MessageService],
})
export class AllRegistrationComponent {
//This Compoment Is Not In Use. Kindy USE OpenRegistrationComponent

  _sellAllOngoing: any;
  _updateEventOnView:any;
   isSigned: boolean;
   event_id:number=0;
   _isRegister:boolean = false;
   _eventId: any;
  searchedString: any;
  constructor(private messageService: MessageService, 
    private seeAllEvents:SeeAllEventsService,private router: Router,  private encyptDecryptService: EncyptDecryptService){
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
  _showLoader: boolean = false;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    if(this.isSigned===true){
      this. _showLoader = true;
      this.seeAllEvents.sellAllOngoing('register_events').subscribe({
      next: (data: any) => {
        this._sellAllOngoing = data.body;
        this. _showLoader = false;

      },
      error: (result: any) => {
       
      },
      complete: () => console.info('complete')
    })
  }
  else{
    this. _showLoader = true;
    this.seeAllEvents.sellAllOngoingAtHome('register_events').subscribe({
    next: (data: any) => {
      this._sellAllOngoing = data.body;
      this. _showLoader = false;
    },
    error: (result: any) => {
    },
    complete: () => console.info('complete')
  })
  localStorage.removeItem('event_data')
}
  }
  updateEvent(e:any){
    this._updateEventOnView = e;
    this. _showLoader = true;
    localStorage.setItem('event_data',JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);
    this. _showLoader = false;
  }
  navigateToRegisteration(data:any){
    //routerLink="/registration/register"
    this._updateEventOnView = data;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      data.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
   // this.router.navigate(['/registration/register']);
    this.event_id = data.event_id;
    this._isRegister = true;
  }
  searchMatches(){
    this._showLoader = true;
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
