import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { BannerManagementService } from '../../admin/banner-management/banner-management.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _imagePublished: any;
  _videoArray = [
    { src: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
    { src: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
    { src: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
    { src: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' },
  ];
  _videoSlider = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    // autoplayTimeout: 1000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 1000,
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
  headerImageSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoHeight: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
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
    nav: false,
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
  ongoingEvents: any;
  onGoingHeading: any;
  onGoingAddress: any;
  onGoingStartDate: any;
  onGoingEndDate: any;
  ongoingImage: any;
  _upComingEvent: any;
  _registerEvent: any;
  _ongoingEvents: any;
  isSigned: boolean;
  _updateEventOnView: any;
  _ongoingArray: any;
  onGoingAllCheck: any;
  upComingCheck: any;
  registerCheck: any;
  recentCheck: any;
  _showLoader: boolean = false;
  _recentEvents = [

  ]

  constructor(private bannerService: BannerManagementService, private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService, private router: Router, private seeAllEvents: SeeAllEventsService) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }

  }

  ngOnInit(): void {
    this.getPublish();
    this.getEventsArrayWise();
    localStorage.removeItem('event_data');
    localStorage.removeItem('event_id')
  }
  getPublish() {
    this.bannerService.getPublish().subscribe((res: any) => {
      this._imagePublished = res.body.published.map((urlImg: any) => urlImg.url).slice(0, 5);
    });
  }


  getEventsArrayWise() {
    this._showLoader = true;
    this.eventsService.getEventsinArrayHome().subscribe(
      {
        next: (result: any) => {
          this._showLoader = false;
          this._ongoingEvents = result.body.ongoing_events[1].slice(1);
          this.onGoingHeading = result.body.ongoing_events[1][0].event_name;
          this._ongoingArray = result.body.ongoing_events[1][0];
          this.onGoingAddress = result.body.ongoing_events[1][0].address;
          this.onGoingStartDate = result.body.ongoing_events[1][0].event_start_time;
          this.onGoingEndDate = result.body.ongoing_events[1][0].event_end_time;
          this.ongoingImage = result.body.ongoing_events[1][0].image_url;

          this._upComingEvent = result.body.upcoming_events[1].slice(0, 3);

          this._registerEvent = result.body.register_events[1].slice(0, 3);
          this.onGoingAllCheck = result.body.ongoing_events[1].length;
          this.upComingCheck = result.body.upcoming_events[1].length;
          this.registerCheck = result.body.register_events[1].length;
          this.recentCheck = result.body.recent_events[1].length;


        },
        error: (result) => {
          this._showLoader = false;
        },
        complete: () => {
          this._showLoader = false;
        }
      }
    );
  }

  updateEvent(e: any) {
    localStorage.removeItem('eventDetailsForViewer')
    localStorage.setItem('eventDetailsForViewer', JSON.stringify(e));
    this.router.navigate(['/viewer/fixture']);
    // if (e === true) {
    //   this.seeAllEvents.getData = this._ongoingArray

    // }
    // else {
    //   this._updateEventOnView = e;
    //   this.seeAllEvents.getData = this._updateEventOnView;
    // }
    // this.router.navigate(['/viewer/fixture']);
    // const dd = this.encyptDecryptService.encryptUsingAES256(
    //   e.event_id.toString()
    // );
    // localStorage.setItem('event_id', dd);
  }
  OngoingseeALL() {
    this.router.navigate(['/home/all-ongoing-events', 'home']);
  }
  upcomingSeeALL() {
    this.router.navigate(['home/all-upcoming-events', 'home']);
  }
  registerOpen() {
    this.router.navigate(['registration/open-reg', 'home']);
  }
}
