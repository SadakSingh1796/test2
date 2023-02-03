import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/Account/account.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  //Here we are declaring form variable
  _loginForm!: FormGroup;
  //This is for validation with the help of it we are able to fire validation
  _isSubmit: boolean = false;
  _responseData: any = [];
  __change_image = '../../../assets/icons/eyes/eye_OPEN.png';
  __image1 = '../../../assets/icons/eyes/eye_CLOSE.png';
  __image2 = '../../../assets/icons/eyes/eye_OPEN.png';
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private route: Router,
    private messageService: MessageService,
    private cookie: CookieService,
    private encyptDecryptService: EncyptDecryptService
  ) {
    //Here we are adding form Control name
    this._loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit(): void { }
  showPassword(data: any) {
    const eye = document.querySelector('#eye');
    if(data.type === 'password' && this.__change_image ==this.__image2){
      data.type='text';
      this.__change_image = this.__image1;
    }
    else if(data.type === 'text' && this.__change_image ==this.__image1){
      data.type='password';
      this.__change_image = this.__image2;
    }

    // const eye = document.querySelector('#eye');
    // data.type = type;
    // eye?.classList.toggle('pi-eye');
  }
  //For Login User With Email And Password
  login() {
    this._isSubmit = true;
    if (this._loginForm.valid) {
      const body = {
        email: this._loginForm.controls['email'].value,
        password: this._loginForm.controls['password'].value,
      };
      this.accountService.login(body).subscribe({
        next: (data: any) => {
          // this.messageService.add({
          //   key: 'bc', severity: 'success', summary: 'Login Successful', detail: data.body.msg, life: 1000,
          // });
          if (
            data.body.access_token !== undefined &&
            data.body.access_token !== null
          ) {

            const responseData = JSON.parse(
              atob(data.body.access_token.split('.')[1])
            );
            this._responseData.push(responseData);
            localStorage.setItem('perm', this._responseData[0].perm_ids);
            if (this._responseData[0].role_id == 4) {
              this.route.navigate(['/admin']);
              // this.cookie.set('admToken', data.body.access_token, {
              //   expires: 1,
              // });
              localStorage.removeItem('reqToken');
              localStorage.setItem('admToken', data.body.access_token);

            } else {
              this.route.navigate(['/home']);
              //this.cookie.set('reqToken', data.body.access_token);
              localStorage.removeItem('admToken');
              localStorage.setItem('reqToken', data.body.access_token);
            }
          }
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => console.info('complete'),
      });
    }
  }
}
