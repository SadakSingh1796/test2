import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountService } from 'src/app/services/Account/account.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { RoleService } from 'src/app/services/RoleService/role.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { AdminFooterService } from 'src/app/services/AdminFooter/admin-footer.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [MessageService],
})
export class SignUpComponent implements OnInit {
  //#region This code is just for number with max length   --> pattern="/^-?\d+\.?\d*$/" onKeyPress="if(this.value.length==4) return false;"
  //#region Here we are declariong Variables
  _isFirstPage: boolean = true;
  _nextDisabled: boolean = true;
  _isSubmit: boolean = false;
  _iSVerfy: boolean = false;
  _formGroupDynamic!: FormGroup;
  _userRoles: any = [];
  _signUpFields: any = [];
  _formDataWithValues: any = [];
  _finalSignUpFormData: any = [];
  _currentRoleId: any = '';
  _currentName: any = '';
  _userEmail: any = '';
  _userPassword: any = '';
  _userGender: any = '';
  _stateList: any = [];
  _cityList: any = [];
  _stateId: any;
  _fullName: any;
  _parentId: any;
  _genderList: any = [
    {
      id: 1,
      name: 'Male',
    },
    {
      id: 2,
      name: 'Female',
    },
    {
      id: 3,
      name: 'Other',
    },
    // {
    //   id: 4,
    //   name: "None"
    // }
  ];
  _countryList: any = [];
  _responseFieldData: any = [];
  termCondition: boolean = false;
  _currentCountryCode: any = '00-';
  _countryCodeControlsList: any = [];

  _showLoader: boolean = false;
  _terms: any = [];
  _termsLinks: any = [];
  _footerData: any = [];
  _links: any = [];
  _email: string = '';
  __getTitleOnly: any = [];
  __getdataOnly: any = [];
  __getLinks: any = [];

  //#endregion Here we are declariong Variables
  constructor(
    private roleService: RoleService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    @Inject(LOCALE_ID) public activeLocale: string,
    private primengConfig: PrimeNGConfig,
    private commonApiService: CommonApiService,
    private messageService: MessageService,
    private footerService: AdminFooterService
  ) {
    this.getCountiesList();
    this.getRoles();
  }
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this._formGroupDynamic = this.formBuilder.group({});
    this.getFooter();
  }

  //policies link
  getFooter() {
    this._showLoader = true;
    this.footerService.getFooter().subscribe({
      next: (data: any) => {
        this._footerData = data.body.filter(
          (x: any) => x.title === 'Main Footer'
        )[0].data;
        this._terms = data.body.filter(
          (x: any) => x.title === 'Terms & conditions'
        )[0].data;
        for (let i = 0; i < this._terms.links.length; i++) {
          const tempData = {
            title:
              this._terms.links[i].url === ''
                ? undefined
                : this._terms.links[i].title,
            url: this._terms.links[i].url,
            published: this._terms.links[i].published,
            isClicked: false,
          };
          this._termsLinks.push(tempData);
        }

        for (let i = 0; i < this._footerData.links.length; i++) {
          const data = {
            title: this._footerData.links[i].title,
            url: this._footerData.links[i].url,
            published: this._footerData.links[i].published,
            isClicked: false,
          };
          this._links.push(data);
          this._email = this._footerData.contact;
        }

        this.__getTitleOnly = data.body[3];
        this.__getdataOnly = this.__getTitleOnly.data.links;

        for (let i = 0; i < this.__getTitleOnly.data.links.length; i++) {
          const collectData = {
            title: this.__getTitleOnly.data.links[i].title,
            url: this.__getTitleOnly.data.links[i].url,
            published: this.__getTitleOnly.data.links[i].published,
            isClicked: false,
          };
          this.__getLinks.push(collectData);
        }
      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => console.info('complete'),
    });
    this._showLoader = false;
  }

  //#region  We use this method for Get Roles
  getRoles() {
    this.roleService.getRolesForWeb().subscribe({
      next: (result: any) => {
        this._userRoles = [];
        for (let i = 0; i < result.body.length; i++) {
          const dataRole = {
            roleName: result.body[i].title,
            role_id: result.body[i].role_id,
            checked: false,
          };
          this._userRoles.push(dataRole);
        }
      },
      error: (result) => {},
      complete: () => console.info('complete'),
    });
  }
  //#endregion We use this method for Get Roles
  //#region Getting Country List
  getCountiesList() {
    this.commonApiService.getCountriesList().subscribe({
      next: (result: any) => {
        this._countryList = result.body;
      },
      error: (result) => {},
      complete: () => {},
    });
  }
  //#endregion
  //#region Getting State List
  getState() {
    if (this._formGroupDynamic.controls['city'] !== undefined) {
      this._formGroupDynamic.controls['city'].setValue('');
    }
    this._cityList = [];
    this._stateList = [];
    this._currentCountryCode =
      this._formGroupDynamic.controls['country'].value.country_code + '-';
    for (let i = 0; i < this._signUpFields.length; i++) {
      if (this._signUpFields[i].data_type == 'phone') {
        this._formGroupDynamic.controls[this._signUpFields[i].id].setValue(
          this._currentCountryCode
        );
      }
    }

    this.commonApiService
      .getStateList(this._formGroupDynamic.controls['country'].value.country_id)
      .subscribe({
        next: (result: any) => {
          this._stateList = result.body;
        },
        error: (result) => {},
        complete: () => {},
      });
  }
  //#endregion Getting State List
  //#region Getting City  List
  getCityList() {
    if (this._formGroupDynamic.controls['city'] !== undefined) {
      this._formGroupDynamic.controls['city'].setValue('');
    }
    this._cityList = [];
    this.commonApiService
      .getCityList(this._formGroupDynamic.controls['state'].value.state_id)
      .subscribe({
        next: (result: any) => {
          this._cityList = result.body;
        },
        error: (result) => {},
        complete: () => {},
      });
  }
  //#endregion Getting City List
  //#region Here we are dynamically generating form controlsName with Json Data base on Role select
  constrolsFormDynamically(listOfFields: any) {
    const group: any = {};
    for (var field of listOfFields) {
      if (field.data_type == 'text') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'number') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'file') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'email') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'password') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'dropdown') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'date') {
        group[field.id] = new FormControl('', []);
      } else if (field.data_type == 'phone') {
        group[field.id] = new FormControl('', []);
      }
      //  else if (field.data_type == 'dropdown') {
      //   group[field.name] = new FormControl(field.value || '', Validators.required);
      // } else if (field.data_type == 'radio') {
      //   group[field.name] = new FormControl(false, null);
      // } else if (field.data_type == 'date') {
      //   group[field.name] = new FormControl(field.value || '', [
      //     Validators.required,
      //   ]);
      // }
      // else if (field.type == 'password') {
      //   group[field.name] = new FormControl( '', [
      //     Validators.required,
      //   ]);
      // }
    }
    this._formGroupDynamic = new FormGroup(group);
    this.setValidation(listOfFields);
  }
  //#endregion Here we are dynamically generating form controlsName with Json Data base on Role select
  //#region  With Help of this method we are genetrating validation dynamicaly as per our requirement
  setValidation(controlNames: any) {
    for (var field of controlNames) {
      if (field.data_type == 'text') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.required
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'number') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.required
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'phone') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.required
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'email') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.compose([
              Validators.required,
              Validators.pattern(
                '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
              ),
            ])
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
          // this._formGroupDynamic.controls[field.id].setValidators(Validators.required);
          // this._formGroupDynamic.controls[field.id].updateValueAndValidity();
          // this._formGroupDynamic.controls[field.id].setValidators(Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'));

          // this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'file') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.required
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'password') {
        if (field.mandatory) {
          var pwd =
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$';
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.compose([
              Validators.required,
              Validators.maxLength(70),
              Validators.pattern(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
              ),
              Validators.minLength(8),
            ])
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'dropdown') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.compose([Validators.required])
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      } else if (field.data_type == 'date') {
        if (field.mandatory) {
          this._formGroupDynamic.controls[field.id].setValidators(
            Validators.compose([Validators.required])
          );
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        } else {
          this._formGroupDynamic.controls[field.id].setErrors(null);
          this._formGroupDynamic.controls[field.id].clearValidators();
          this._formGroupDynamic.controls[field.id].updateValueAndValidity();
        }
      }
    }
  }
  //#endregion With Help of this method we are genetrating validation dynamicaly as per our requirement
  //#region With this we use change page 1 and page 2
  nextPage() {
    this._isFirstPage = false;
  }
  //#endregion With this we use change page 1 and page 2
  //#region  With this method we are going back at page 1
  back() {
    this._isFirstPage = true;
    this._signUpFields = [];
    this.getRoles();
    this._nextDisabled = true;
    this._isSubmit = false;
  }
  //#endregion With this method we are going back at page 1
  //#region  With this method we are getting current Role for Check True False at first page
  currentRole(event: any) {
    for (let i = 0; i < this._userRoles.length; i++) {
      if (event.target.checked) {
        this._nextDisabled = false;
        if (
          this._userRoles[i].roleName == event.target.value &&
          event.target.checked
        ) {
          this._userRoles[i].checked = true;
          this._currentName = this._userRoles[i].roleName;
          this._currentRoleId = this._userRoles.filter(
            (x: any) => x.roleName == event.target.value
          )[0].role_id;
          this.roleService
            .getFieldsForWeb(
              this._userRoles.filter(
                (x: any) => x.roleName == event.target.value
              )[0].role_id
            )
            .subscribe((fieldResponse: any) => {
              this._signUpFields = [];
              this._responseFieldData = [];
              this._responseFieldData = [
                {
                  data_type: 'text',
                  field_id: '00',
                  description: 'Full Name',
                  title: 'Full Name',
                  input_type: 'text',
                  mandatory: true,
                  id: 'fullName',
                },
                {
                  data_type: 'email',
                  field_id: '00',
                  description: 'Email',
                  title: 'Email',
                  input_type: 'email',
                  mandatory: true,
                  id: 'email',
                },
                {
                  data_type: 'password',
                  field_id: '00',
                  description: 'Password',
                  title: 'Password',
                  input_type: 'Password',
                  mandatory: true,
                  id: 'password',
                },
              ];
              for (i = 0; i < fieldResponse.body.length; i++) {
                this._responseFieldData.push(fieldResponse.body[i]);
              }
              this.constrolsFormDynamically(this._responseFieldData);
              this._signUpFields = this._responseFieldData;
            });
        } else {
          this._userRoles[i].checked = false;
        }
      } else {
        this._currentRoleId = '';
        this._nextDisabled = true;
      }
    }
  }
  //#endregion With this method we are getting current Role for Check True False at first page
  //#region Final Submit Full form With ControlName and values
  SignUpSubmit() {
    this._isSubmit = true;
    if (this.termCondition) {
      if (this._formGroupDynamic.valid) {
        for (let i = 0; i < this._signUpFields.length; i++) {
          if (this._signUpFields[i].data_type == 'email') {
            this._userEmail =
              this._formGroupDynamic.controls[this._signUpFields[i].id].value;
            localStorage.setItem('UserEmail', this._userEmail);
          } else if (this._signUpFields[i].id == 'password') {
            this._userPassword =
              this._formGroupDynamic.controls[this._signUpFields[i].id].value;
          } else if (this._signUpFields[i].id == 'gender') {
            this._userGender =
              this._formGroupDynamic.controls[
                this._signUpFields[i].id
              ].value.id;
          } else if (this._signUpFields[i].id == 'state') {
            this._stateId =
              this._formGroupDynamic.controls[
                this._signUpFields[i].id
              ].value.state_id;
          } else if (this._signUpFields[i].id == 'fullName') {
            this._fullName =
              this._formGroupDynamic.controls[this._signUpFields[i].id].value;
          }
          if (this._signUpFields[i].data_type == 'email') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[
                this._signUpFields[i].id
              ].value.toLowerCase(),
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].id == 'gender') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[this._signUpFields[i].id]
                .value.id,
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].id == 'state') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[this._signUpFields[i].id]
                .value.state_id,
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].id == 'country') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[this._signUpFields[i].id]
                .value.country_id,
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].id == 'city') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[this._signUpFields[i].id]
                .value.city_id,
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].data_type == 'phone') {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data:
                this._currentCountryCode +
                this._formGroupDynamic.controls[this._signUpFields[i].id].value,
            };
            this._finalSignUpFormData.push(data);
          } else if (this._signUpFields[i].id == 'parent_id') {
            this._parentId =
              this._formGroupDynamic.controls[
                this._signUpFields[i].id
              ].value.id;
          } else {
            const data = {
              role_id: this._currentRoleId,
              field_id: this._signUpFields[i].field_id,
              data: this._formGroupDynamic.controls[this._signUpFields[i].id]
                .value,
            };
            this._finalSignUpFormData.push(data);
          }
        }

        this._iSVerfy = true;
      }
    } else {
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Term & Condition',
        detail: 'Accept Term And Conditions',
        life: 1000,
      });
    }
  }

  //#endregion Final Submit Full form With ControlName and values
  numberValueSet(evt: any) {
    // prevent: "e", "=", ",", "-", "."
    if ([69, 187, 188, 189, 190].includes(evt.keyCode)) {
      evt.preventDefault();
    }
  }
  __change_image = '../../../assets/icons/eyes/eye_CLOSE.png';
  __image1 = '../../../assets/icons/eyes/eye_CLOSE.png';
  __image2 = '../../../assets/icons/eyes/eye_OPEN.png';
  showPassword(data: any) {
    const eye = document.querySelector('#eye');
    if (data.type === 'password' && this.__change_image == this.__image1) {
      data.type = 'text';
      this.__change_image = this.__image2;
    } else if (data.type === 'text' && this.__change_image == this.__image2) {
      data.type = 'password';
      this.__change_image = this.__image1;
    }
  }
__toggleMask=true;

}
