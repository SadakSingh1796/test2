import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MembershipService } from 'src/app/services/MemberShip/membership.service';

@Component({
  selector: 'app-buy-membership',
  templateUrl: './buy-membership.component.html',
  styleUrls: ['./buy-membership.component.scss'],
})
export class BuyMembershipComponent implements OnInit {
  cardList = [
    {
      title: 'Gold',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
    {
      title: 'Silver',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },

    {
      title: 'Bronze',
      price: '$500',
      features: [
        { name: 'buy 1 get 1 analysis' },
        { name: 'get demo practise' },
        { name: 'demo' },
        { name: 'demo' },
      ],
    },
  ];
  _memberShipList: any = [];
  _monthlyList: any = [];
  _yearlyList: any = [];
  _isNotMonthly: boolean = false;
  constructor(private membershipService: MembershipService,) {
    this.getMemberShip();
  }

  headerImageSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
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
        items: 3,
      },
    },
    nav: true,
  };

  ngOnInit(): void { }
  getMemberShip() {
    this.membershipService.getMemships().subscribe({
      next: (result: any) => {

        this._memberShipList = result.body
        this._monthlyList = this._memberShipList.filter((x: any) => (x.data.duration == 6 || x.data.duration == 0) && x.published);
        this._yearlyList = this._memberShipList.filter((x: any) => x.data.duration !== 6 && x.data.duration !== 0 && x.published);
      },
      error: (result: any) => {

      },
      complete: () => console.info('complete')
    })
  }
  buyMemberShip(data: any) {
    
    const body = {
      "membership_id": data.membership_id
    }
    this.membershipService.buyMemberShip(body).subscribe({
      next: (result: any) => {
        
      },
      error: (result: any) => {
        
      },
      complete: () => {
        
      }
    })
  }
}
