import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'stupa-recent-videos-view',
  templateUrl: './recent-videos-view.component.html',
  styleUrls: ['./recent-videos-view.component.scss']
})
export class RecentVideosViewComponent {
  _pageMainTitle: any = 'Under Development!';
  _pageSubTitle: any = 'We Will Get Back To you soon.';
  _buttonTitle: any = 'Create Matches';
  p:any
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 25,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };
  _commonMatchesArray: any = [
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's", isLive: true },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Semi Finals', category: "Under 19", isLive: true },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Quater Finals', category: "Women's", isLive: true },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's", isLive: true },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's" },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's" },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's" },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's", isLive: true },
    { src: '../../../assets/icons/svg/live matches/demo.svg', playerAName: 'Ma Long', playerBName: 'Fan Zhendong', view: 950, event: 'WTT Star Contender', round: 'Round 16', category: "men's", isLive: true },

  ]
  _eventArray: any = [
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
    { src: '../../../assets/icons/svg/live matches/demo.svg', eventName: 'WTT Youth Contender Szombathely 2022', place: 'Bella Italia EFA Village Sports Hall Lignano Sabbiadoro, Italy', date: '30 Oct - 5 Nov 2022' },
  ]
  constructor(public router: Router) { }

  ngOnInit(): void { }
  eventClicked() {
    this.router.navigateByUrl('/home');
  }
  viewMatches() {
    this.router.navigateByUrl('/live-matches/recent/view')
  }
}
