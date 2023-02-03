import { Component, OnInit } from '@angular/core';
import { AdminFooterService } from 'src/app/services/AdminFooter/admin-footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  _footerData: any = [];
  _mainFooter: any = [];
  _termAndCond: any = [];
  _logo: string = '';
  _links: any = [];
  _fbLink: any = [];
  _fbUrl: string = '';
  _email: string = "";
  _terms: any = [];
  _termsLinks: any = [];
  _showLoader: boolean = false;
  constructor(private footerService: AdminFooterService) { }

  ngOnInit(): void {
    this.getFooter();
  }
  /*get data from API and display in footer */
  getFooter() {
    this._showLoader = true;
    this.footerService.getFooter().subscribe({
      next: (data: any) => {
        this._footerData = data.body.filter((x: any) => x.title === 'Main Footer')[0].data;
        this._terms = data.body.filter((x: any) => x.title === 'Terms & conditions')[0].data;
        for (let i = 0; i < this._terms.links.length; i++) {
          const tempData = {
            "title": this._terms.links[i].url===""?undefined: this._terms.links[i].title,
            "url": this._terms.links[i].url,
            "published": this._terms.links[i].published,
            "isClicked": false
          }
          this._termsLinks.push(tempData);
        }

        for (let i = 0; i < this._footerData.links.length; i++) {
          const data = {
            "title": this._footerData.links[i].title,
            "url": this._footerData.links[i].url,
            "published": this._footerData.links[i].published,
            "isClicked": false
          }
          this._links.push(data)
          this._email = this._footerData.contact;
        }
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => console.info('complete')
    })
    this._showLoader = false;
  }
  anchorClick(event: any) {
    window.open(event);
  }
}
