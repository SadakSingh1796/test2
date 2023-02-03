import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-event-organiz',
  templateUrl: './event-organiz.component.html',
  styleUrls: ['./event-organiz.component.scss'],
})
export class EventOrganizComponent implements OnInit {
  innerWidth: any;
  _videoArray = [
    { src: 'https://www.youtube.com/watch?v=S4ad8Cpu11Q' },
    { src: 'https://www.youtube.com/watch?v=S4ad8Cpu11Q' },
    { src: 'https://www.youtube.com/watch?v=S4ad8Cpu11Q' },
    { src: 'https://www.youtube.com/watch?v=S4ad8Cpu11Q' },
  ];
  _imgArray = [];
  _ongoingEvents: any = [];
  _upComingEvent: any=[];
  _registerEvent: any=[];
  _updateEventOnView: any;
  onGoingAllCheck: any;
  upComingCheck: any;
  registerCheck: any;
  recentCheck: any;
  _homeToEvent: any;
  _showLoader: boolean = false;
  _ongoingArray: any = [];
    event_id:number=0;
   _isRegister:boolean = false;
  _upComingLength: any=[];
  _registerLength: any=[];
  _permissions:boolean = false;
  _buttonTitle='Kindly Contact Your Admin!';
  _pageMainTitle='Forbidden!';
  _pageSubTitle='You do not have Permission for this Particular Module.'
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(private eventsService: EventsService,
    private encyptDecryptService: EncyptDecryptService,private router:Router) {
    this.innerWidth = window.innerWidth;
    if(localStorage.getItem('perm')?.includes('6')){
      this._permissions = true;
    }
   
  }

  _videoSlider = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  _recentEventsSlider = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };
  _eventId :any = 0;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getEventsArrayWise();
    
  }
  getEventsArrayWise(){
    this._showLoader = true;
    this.eventsService.getEventsinArray().subscribe(
      {
        next: (result: any) => {
          this._showLoader = false;
          this._upComingEvent = result.body.upcoming_events[1].slice(0,3);
          this._upComingLength = result.body.upcoming_events[1];
          this._registerLength = result.body.register_events[1];
          this._registerEvent = result.body.register_events[1].slice(0,3);
          this._ongoingEvents= result.body.ongoing_events[1];
          
        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => {
        }
      }
    );
  }

  updateEvent(e:any){
      this._updateEventOnView = e;
      this._homeToEvent = this._updateEventOnView;
      localStorage.setItem('event_data',JSON.stringify(this._homeToEvent));
      const dd = this.encyptDecryptService.encryptUsingAES256(
        e.event_id.toString()
      );
      localStorage.setItem('event_id', dd);
      this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
       
    this.router.navigate(['/event/create-event']);
    
    
  }
  removeEventId(){
    localStorage.removeItem('event_data');
    localStorage.removeItem('event_id');
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  navigateToRegisteration(data:any){
    this._updateEventOnView = data;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      data.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
   this.router.navigate(['/open-reg']);
    this.event_id = data.event_id;
    this._isRegister = true;
  }
  allOngoingEvent(){
  this.router.navigate(['/home/all-ongoing-events','organize']);
  }
  upcomingSeeALL(){
    this.router.navigate(['home/all-upcoming-events','organize']);
  }
  registerOpen(){
    this.router.navigate(['registration/open-reg','organize']);
  }
}

