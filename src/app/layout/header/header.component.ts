import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSigned: boolean = false;
  innerWidth: any;
  containerMenu: any;
  show_languages2: any;
  _activeIndex: any = '';
  // hover: boolean = false;
  click: boolean = false;

  event: any;
  @Output() tabIndex = new EventEmitter<number>();
  _router: any;
  // supportLanguages: any;
  value1: string = 'En';
  supportLanguages = ['English', 'Portuguese'];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  __change_image = '../../../assets/icons/chevron_down.png';
  __image1 = '../../../assets/icons/chevronUP.png';
  __image2 = '../../../assets/icons/chevron_down.png';

  changeIcon(event: any) {
    if (event.type == 'click' && this.__change_image === this.__image2) {
      this.__change_image = this.__image1;
    } else if (event.type == 'click' && this.__change_image === this.__image1) {
      this.__change_image = this.__image2;
    }
  }
  english: any = '';
  Portuguese: any = '';


  constructor(
    private router: Router,
    private translateService: TranslateService,
    public encyptDecryptService: EncyptDecryptService
  ) {
    this.translateService.addLangs(['English', 'Portuguese']);
    this.translateService.setDefaultLang('English');
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    this.innerWidth = window.innerWidth;
    this._activeIndex = 'home';
    this._router = router;
  }

  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
  }
  requestVerification() {
    this.router.navigate(['requests']);
  }
  toggleFunction() {
    this.containerMenu = document.getElementById('containerMenu');
    this.containerMenu?.classList.toggle('openMenu');

    //changes ends here
  }

  logout() {
    localStorage.removeItem('reqToken');
    localStorage.clear();
    this.router.navigate(['/account/login']);
  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }


  UseLanguage(getlang: any, op:any) {
    this.translateService.use(getlang);
    op.hide();
  }
  hide(menuPopup:any){
    menuPopup.hide();
  }
 
  activeNav(data: any, name: any) {
    this._activeIndex = name;
  }
  eventClicked() {
    this.tabIndex.emit();
  }
}
