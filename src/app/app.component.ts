import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'stupa';
  supportLanguages = ['English', 'Portuguese'];
  favIcon: any = document.querySelector('#appIcon');
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang('English');
    this.changeIcon();
  }
  ngOnInit(): void {
    AOS.init();
  }
  changeIcon() {
    document.title = 'CBTM';
  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }
}
