import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { RoleService } from 'src/app/services/RoleService/role.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  providers: [MessageService],
})
export class EventDetailsComponent implements OnInit, OnChanges {
  _dialogStyle = {
    width: '70vw',
  };
  _eventDetailForm!: FormGroup;
  _eventForm!: FormGroup;
  _published: any;
  _startDate1: any;
  _browedImage: any;
  _publishResponse: string = 'failed';
  _level = [
    { Id: 1, name: 'beginner' },
    { Id: 2, name: 'Intermediate' },
    { Id: 3, name: 'Advance' },
  ];
  _showDisabled: boolean = false;
  _showDisableAndAbleDiv: any = false;
  _isSubmitEventDetail: boolean = false;
  _isSubmitEvent: boolean = false;
  _selectedBanner: any;
  _showBanner: boolean = false;
  _isEventEdit: boolean = false;
  _defaultImages = [
    '../../../../assets/tms/content/defaultbanner1.png',
    '../../../../assets/tms/content/defaultbanner2.png',
  ];
  _eventLevels: any = [];
  _eventStatus: any = [];
  _eventFixtureFormat: any = [];
  _eventParticipantType: any = [];
  _eventClassList: any = [];
  _gender: any = [];
  _eventCycleList: any = [];
  _eventTypes: any = [];
  _categoryClassList: any = [];
  _finalCatClassList: any = [];
  _isPublished: boolean = false;
  _catIndex: any;
  @Output() tabToIndex = new EventEmitter<number>();
  _abled = [
    {id: '1', typeName: 'Abled - (Normal)', inactive: false},
    {id: '2', typeName: 'Dis-Abled - (Para)', inactive: true},
];
_disabled = [
  {id: '2', typeName: 'Dis-Abled - (Para)', inactive: false},
  {id: '1', typeName: 'Abled - (Normal)', inactive: true},
  
];
  _eventCards = [
    {
      category: 'Category name 123',
      fixtureFormat: 'Knockout',
      participantType: 'Miixed-doubles',
      gender: 'Male',
    },
    {
      category: 'Category name 123',
      fixtureFormat: 'Knockout',
      participantType: 'Miixed-doubles',
      gender: 'Male',
    },
    {
      category: 'Category name 123',
      fixtureFormat: 'Knockout',
      participantType: 'Miixed-doubles',
      gender: 'Male',
    },
    {
      category: 'Category name 123',
      fixtureFormat: 'Knockout',
      participantType: 'Miixed-doubles',
      gender: 'Male',
    },
    {
      category: 'Category name 123',
      fixtureFormat: 'Knockout',
      participantType: 'Miixed-doubles',
      gender: 'Male',
    },
  ];
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
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
  _countryList: any = [];
  _stateList: any = [];
  _cityList: any = [];
  _selectedUpdateBanner: any;
  _getBannerUrl: any;
  _uploadImage: any;
  showImage: boolean | undefined;
  _notSelectedImage: boolean = false;
  _categories: any;
  _updateEventFlag :boolean = false;
  _ddFlag: any;
  deletedCategoryId: any = [];
  _getUpdatedImageUrl: any;
  @Input() _updateEventOnView: any = [];
  _existingCat: any = [];
  _existingCategories: any=[];
  _register: any = [

  ]
  _selectedItem: any
  gender_id: any;
  participant_id: any;
  _isImageFlag = false;
  _userRoles: any;
  _currentDate: any = new Date();
  _categoriesData: any = [];
  _categoriesDataNew: any;
  _eventUpdatedData: any;
  _masterCategoriesList: any = []
  _isEventEditAfterView: boolean = false;
  _showLoader: boolean = false;
  _uploadImageonUpdate: any;
  _createMasterCategories: any = [];
  _newMasterCategoriesUpdate: any = [];
  _newCategoriesUpdate: any = [];
  _showPublish: boolean = false;
  _dummyID:any=''
  _showMessage: boolean=false;
  _showSuccess: any;
  _dob: any = [];
  _existingFlag: boolean=false;
  _showUpdateMessage: any = false;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private jsonDataCallingService: JsonDataCallingService,
    private eventsService: EventsService,
    private commonApiService: CommonApiService,
    private seeAllEvents: SeeAllEventsService, private roleService: RoleService,
    private profileMenuService: ProfileMenuService,
    private encyptDecryptService: EncyptDecryptService , private router: Router,
  ) {
    this.loadEventDetailForm();
    this.loadEventForm();
    this.eventsType();
    this.eventsLevels();
    this.eventsFixtureFormat();
    this.eventsParticipant();
    this.eventsClass();
    this.getGender();
    this.eventsStatus();
    this.getEventCycle();
    this.getCountryList();
    this.getDefaultImages();
    this.getEntries();
    this.getMasterCategories()


  }
  ngOnInit(): void {
    
    if (localStorage.getItem('event_data')) {
      this._eventUpdatedData = localStorage.getItem('event_data');
      this._eventUpdatedData = JSON.parse(this._eventUpdatedData);
      this._dob = this._eventUpdatedData.categories.map((dob: any) => dob.dob_cap)[0].toString()
      this.getUpdatedData();
      return
    }
    if (localStorage.getItem('event_id')){
      this.getDetailsByEventId();
    }
  }
  ngOnChanges(changes: SimpleChanges) {

  }
 
  loadEventForm() {
    this._eventForm = this.formBuilder.group({
      eventType: new FormControl('', Validators.compose([Validators.required])),
      eventClass: new FormControl(''),
      gender: new FormControl(''),
      participantType: new FormControl(''),
      bornAfter: new FormControl(
        '',
      ),
      categoryName: new FormControl(''),
    });
  }
  loadEventDetailForm() {
    this._eventDetailForm = this.formBuilder.group({
      isPublish: new FormControl(
        false,
      ),
      eventName: new FormControl('', Validators.compose([Validators.required])),
      eventLevel: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventStatus: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventCycle: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventCity: new FormControl('',Validators.compose([Validators.required])
      ),
      eventState: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventCountry: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventAddress: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventStartDate: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      eventEndDate: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      registrationStartDate: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      registrationEndDate: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      accessPermission: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }
  eventsType() {
    this.jsonDataCallingService.eventsType().subscribe({
      next: (result: any) => {
        this._eventTypes = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  eventsLevels() {
    this.jsonDataCallingService.getLevels().subscribe({
      next: (result: any) => {
        this._eventLevels = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  eventsStatus() {
    this.jsonDataCallingService.eventsStatus().subscribe({
      next: (result: any) => {
        this._eventStatus = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  eventsFixtureFormat() {
    this.jsonDataCallingService.eventsFixtureFormat().subscribe({
      next: (result: any) => {
        this._eventFixtureFormat = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  eventsParticipant() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  eventsClass() {
    this.jsonDataCallingService.eventsClass().subscribe({
      next: (result: any) => {
        this._eventClassList = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  getGender() {
    this.jsonDataCallingService.getGender().subscribe({
      next: (result: any) => {
        this._gender = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  getEventCycle() {
    this.jsonDataCallingService.getEventCycle().subscribe({
      next: (result: any) => {
        this._eventCycleList = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  creatEvent() {
    if(this._isPublished){
      this._showPublish = this._isPublished;
    }
    else{
    if (this._eventDetailForm.valid && this._selectedBanner) {
      if (this._eventForm.valid || this._categoryClassList.length > 0) {
        this._isSubmitEvent = false;
        this._isSubmitEventDetail = false;
        this._showLoader = true;
        this._createMasterCategories = []
        for (let i = 0; i < this._categoryClassList.length; i++) {
          const dataMaster = {
            category_id: this._categoryClassList[i].category_id,
            dob_cap: this._categoryClassList[i].dob_cap
          };
          this._createMasterCategories.push(dataMaster);
        }

        for (let i = 0; i < this._categoryClassList.length; i++) {
          const data = {
            category_description: this._categoryClassList[i].category_description,
            participant_type_id: this._categoryClassList[i].participant,
            gender_id: this._categoryClassList[i].gender,
            dob_cap: this._categoryClassList[i].dob_cap

          };
          this._finalCatClassList.push(data);
        }

        

        if (!this.showImage) {
          var data = {
            event_data: {
              parent_event_id: 0,
              event_name: this._eventDetailForm.controls['eventName'].value,
              level_id: this._eventDetailForm.controls['eventLevel'].value,
              status_id: this._eventDetailForm.controls['eventStatus'].value,
              cycle_id: this._eventDetailForm.controls['eventCycle'].value,
              city_id: this._eventDetailForm.controls['eventCity'].value,
              country_id: this._eventDetailForm.controls['eventCountry'].value,
              state_id: this._eventDetailForm.controls['eventState'].value,
              address: this._eventDetailForm.controls['eventAddress'].value,
              event_start_time: this._eventDetailForm.controls['eventStartDate'].value,
              event_end_time: this._eventDetailForm.controls['eventEndDate'].value ,
              reg_start_time: this._eventDetailForm.controls['registrationStartDate'].value,
              reg_end_time: this._eventDetailForm.controls['registrationEndDate'].value,
              published: this._eventDetailForm.controls['isPublish'].value,
              event_type: this._eventForm.controls['eventType'].value,
              image_url: '',
              role_registration: this._eventDetailForm.controls['accessPermission'].value
            },
            category_list: this._eventForm.controls['eventType'].value==1 ? undefined : this._finalCatClassList,
            master_categories:  this._eventForm.controls['eventType'].value==1 ? this._createMasterCategories : undefined
          };
          const formData = new FormData();
          formData.append('image', this._uploadImage)
          this.eventsService.createEvents(data).subscribe({
            next: (result: any) => {
              this.updateEventImage(result.body, formData);;
              this._showLoader = false;
              var eventId=   this.encyptDecryptService.encryptUsingAES256(result.body.toString());
              localStorage.setItem('event_id',eventId);
              this.getDetailsByEventId();
              this._showPublish = false;
              this._showMessage = true;
              this._showSuccess = true;
              // this.messageService.add({
              //   key: 'bc',
              //   severity: 'success',
              //   summary: 'Info',
              //   detail: 'Event Successfully Created. Now you can add officials',
              //   life: 5000,
              // });
              setTimeout(() => {
                window.location.reload();;
                        }, 4000);
              
              // if(this._eventDetailForm.controls['isPublish'].value==true){
              //   setTimeout(() => {
              //     this.router.navigate(['/event/add-official']);
              //             }, 2000);
                
              // }
            },
            error: (result) => {
              this._showLoader = false;
              this.messageService.add({
                key: 'bc',
                severity: 'error',
                summary: 'error',
                detail: result.error.msg,
                life: 3000,
              });
            },
            complete: () => { },
          });
        }

        else {
          var dataUpload = {
            event_data: {
              parent_event_id: 0,
              event_name: this._eventDetailForm.controls['eventName'].value,
              level_id: this._eventDetailForm.controls['eventLevel'].value,
              status_id: this._eventDetailForm.controls['eventStatus'].value,
              cycle_id: this._eventDetailForm.controls['eventCycle'].value,
              city_id: this._eventDetailForm.controls['eventCity'].value,
              country_id: this._eventDetailForm.controls['eventCountry'].value,
              state_id: this._eventDetailForm.controls['eventState'].value,
              address: this._eventDetailForm.controls['eventAddress'].value,
              event_start_time: this._eventDetailForm.controls['eventStartDate'].value,
              event_end_time: this._eventDetailForm.controls['eventEndDate'].value ,
              reg_start_time: this._eventDetailForm.controls['registrationStartDate'].value,
              reg_end_time: this._eventDetailForm.controls['registrationEndDate'].value,
              published: this._eventDetailForm.controls['isPublish'].value,
              event_type: this._eventForm.controls['eventType'].value,
              image_url: this._selectedBanner,
              role_registration: this._eventDetailForm.controls['accessPermission'].value
            },
            category_list: this._eventForm.controls['eventType'].value==1 ? undefined : this._finalCatClassList,
            master_categories:  this._eventForm.controls['eventType'].value==1 ? this._createMasterCategories : undefined
          };


          this.eventsService.createEvents(dataUpload).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              const dd = this.encyptDecryptService.encryptUsingAES256(
                result.body.toString()
              );
              localStorage.setItem('event_id', dd);
              window.location.reload();
              this.getDetailsByEventId();
              this._showPublish = false;
              this._showMessage = true;
              this._showSuccess = true;
              // this.messageService.add({
              //   key: 'bc',
              //   severity: 'success',
              //   summary: 'Info',
              //   detail: 'Event Successfully Created. Now you can add officials',
              //   life: 5000,
              // });
              // setTimeout(() => {
              //   this.router.navigate(['/event/add-official']);
              //           }, 2000);
              
              // if(this._eventDetailForm.controls['isPublish'].value==true){
              //   setTimeout(() => {
              //     this.router.navigate(['/event/add-official']);
              //             }, 2000);
                
              // }
            },
            error: (result) => {
              this._showLoader = false;
              this.messageService.add({
                key: 'bc',
                severity: 'error',
                summary: 'Error',
                detail: result.error.msg,
                life: 3000,
              });
            },
            complete: () => { },
          });

        }
      }


      else {
        this._isSubmitEvent = true;
      }

    }
    else {
      this._isSubmitEventDetail = true;
      this._isImageFlag = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please Fill all required Details',
        life: 3000,
      });


    }
  }

  }
  getCountryList() {
    this.commonApiService.getCountriesList().subscribe({
      next: (result: any) => {
        this._countryList = result.body;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  getState() {
    this.commonApiService.getStateList(this._eventDetailForm.controls['eventCountry'].value)
      .subscribe({
        next: (result: any) => {
          this._stateList = result.body;
        },
        error: (result) => { },
        complete: () => { },
      });
  }
  getCityList() {
    this.commonApiService
      .getCityList(this._eventDetailForm.controls['eventState'].value)
      .subscribe({
        next: (result: any) => {
          this._cityList = result.body;
        },
        error: (result) => { },
        complete: () => { },
      });
  }
  resetForm() {
    this._showDisableAndAbleDiv = false;
    this._isSubmitEventDetail = false;
    this._eventDetailForm.reset();
    this._eventForm.reset();
    this._categoryClassList = [];
    this._showBanner = false;
  }
  selectedEventType(data: any) {
    this._showDisableAndAbleDiv = true;
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
    this._categoryClassList.length=0;
    this._isSubmitEvent = false;
    if (data.value == 1) {
      this._showDisabled = false;
      this._eventForm.controls['categoryName'].setValidators([
        Validators.required,
      ]);
      // this._categoryClassList.length=0;
    } else {
      this._showDisabled = true;
      this._eventForm.controls['eventClass'].setValidators([
        Validators.required,
      ]);
      // this._categoryClassList.length=0;
    }
  }

  getDefaultImages() {
    this.eventsService.getDefaultBanners().subscribe({
      next: (result: any) => {
        this._getBannerUrl = result.body;
      },
      error: (result) => {
      },
      complete: () => { },
    });
  }
  selectedImage(data: any) {
    this.showImage = true;
    this._showBanner = true;
    this._selectedBanner = data.url;
  }
  creatEvents() {
    this._isSubmitEvent = true;
    if (this._showDisabled) {
      this._eventForm.controls['eventClass'].setValidators(Validators.required);
      this._eventForm.controls['eventClass'].updateValueAndValidity();
      this._eventForm.controls['participantType'].setValidators(Validators.required);
      this._eventForm.controls['participantType'].updateValueAndValidity();
      this._eventForm.controls['gender'].setValidators(Validators.required);
      this._eventForm.controls['gender'].updateValueAndValidity();
      this._eventForm.controls['categoryName'].setErrors(null);
      this._eventForm.controls['categoryName'].clearValidators();
      this._eventForm.controls['categoryName'].updateValueAndValidity();
      this._eventForm.controls['bornAfter'].setErrors(null);
      this._eventForm.controls['bornAfter'].clearValidators();
      this._eventForm.controls['bornAfter'].updateValueAndValidity();


    } else {
      this._eventForm.controls['categoryName'].setValidators(
        Validators.required
      );
      this._eventForm.controls['categoryName'].updateValueAndValidity();
      this._eventForm.controls['bornAfter'].setValidators(Validators.required);
      this._eventForm.controls['bornAfter'].updateValueAndValidity();
      this._eventForm.controls['eventClass'].setErrors(null);
      this._eventForm.controls['eventClass'].clearValidators();
      this._eventForm.controls['eventClass'].updateValueAndValidity();
      this._eventForm.controls['participantType'].setValidators(null);
      this._eventForm.controls['participantType'].clearValidators();
      this._eventForm.controls['participantType'].updateValueAndValidity();
      this._eventForm.controls['gender'].setValidators(null);
      this._eventForm.controls['gender'].clearValidators();
      this._eventForm.controls['gender'].updateValueAndValidity();

    }
    if (this._eventForm.valid) {
      if (this._showDisabled) {
        // Class Select
        for (let i = 0; i < this._categoryClassList.length; i++) {
          if (this._categoryClassList[i].isClass == false) {
            this._categoryClassList = [];
          }
        }
        const data = {
          isClass: true,
          category_description:
            this._eventForm.controls['eventClass'].value.name,
          participant_type_id:
            this._eventForm.controls['participantType'].value.name,
          gender_id: this._eventForm.controls['gender'].value.name,
          participant: this._eventForm.controls['participantType'].value.id,
          gender: this._eventForm.controls['gender'].value.id,

        };
        if (this._categoryClassList.map((x:any)=> x.category_description) == this._eventForm.controls['eventClass'].value.name) 
        {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Duplicate Entry',
            detail: 'Already Exist',
            life: 2000,
          });
          
          
        } else {
          this._categoryClassList.push(data);
          
        }
      } 
      else {
        for (let i = 0; i < this._categoryClassList.length; i++) {
          if (this._categoryClassList[i].isClass) {
            this._categoryClassList = [];
          }
        }
        const data = {

          isClass: false,
          category_description:
            this._eventForm.controls['categoryName'].value.category_description,
          participant_type_id: this._eventParticipantType.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.participant_type_id)[0].name,
          gender_id: this._gender.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.gender_id)[0].name,
          participant: this._eventForm.controls['categoryName'].value.participant_type_id,
          gender: this._eventForm.controls['categoryName'].value.gender_id,
          dob_cap: this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)),
          category_id: this._eventForm.controls['categoryName'].value.category_id
        };

        if (this._categoryClassList.map((x:any)=> x.category_description) == this._eventForm.controls['categoryName'].value.category_description) 
        {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Duplicate Entry',
            detail: 'Already Exist',
            life: 10000,
          });
          
          
        } else {
          this._categoryClassList.push(data);
          
        }
      }
      this._isSubmitEvent = false;
      this._eventForm.controls['eventClass'].setValue('');
      this._eventForm.controls['gender'].setValue('');
      this._eventForm.controls['participantType'].setValue('');
      this._eventForm.controls['bornAfter'].setValue('');
      this._eventForm.controls['categoryName'].setValue('');
    }
  }
  deleteEvent(index: any) {
    this._eventForm.controls['eventType'].setValue('');
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
    this._categoryClassList.splice(index, 1);
  }

  deleteViewedEvent(index: any, item: any) {
    this.deletedCategoryId.push(item.category_id);
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._categoriesData.splice(index, 1);
  }
  editEvent(itemDetail: any, index: any) {
    this._isEventEdit = true;

    this._catIndex = index;
    if (itemDetail.isClass) {
      this._showDisabled = true;
      this._eventForm.controls['eventType'].setValue(2);
      this._eventForm.controls['eventClass'].setValue(
        this._eventClassList.filter(
          (x: any) => x.name == itemDetail.category_description
        )[0]
      );
      this._eventForm.controls['gender'].setValue(
        this._gender.filter((x: any) => x.name == itemDetail.gender_id)[0]
      );
      this._eventForm.controls['participantType'].setValue(
        this._eventParticipantType.filter(
          (x: any) => x.name == itemDetail.participant_type_id
        )[0]
      );
      // this._eventForm.controls['fixtureType'].setValue(
      //   this._eventFixtureFormat.filter(
      //     (x: any) => x.name == itemDetail.format_id
      //   )[0]
      // );
    } else {
      this._showDisabled = false;
      this._eventForm.controls['bornAfter'].setValue(new Date(itemDetail.dob_cap));
      this._eventForm.controls['eventType'].setValue(1);
      //this._eventForm.controls['categoryName'].setValue(itemDetail.category_description);
      this._eventForm.controls['categoryName'].setValue(
        this._masterCategoriesList.filter((x: any) => x.category_description == itemDetail.category_description)[0]);

      this._eventForm.controls['gender'].setValue(this._gender.filter((x: any) => x.name == itemDetail.gender_id)[0]);
      this._eventForm.controls['participantType'].setValue(this._eventParticipantType.filter((x: any) => x.name == itemDetail.participant_type_id
      )[0]
      );
    }
  }
  updateEvents(item: any) {
    this._isEventEdit = false;
    var data;
    for (let i = 0; i < this._categoryClassList.length; i++) {
      if (this._catIndex === i) {
        if (this._categoryClassList[i].isClass) {
          this._eventForm.controls['eventType'].setValue(1);
          data = {
            isClass: true,
            category_description:
              this._eventForm.controls['eventClass'].value.name,

            participant_type_id:
              this._eventForm.controls['participantType'].value.name,
            gender_id: this._eventForm.controls['gender'].value.name,
            //format: this._eventForm.controls['fixtureType'].value.id,
            participant: this._eventForm.controls['participantType'].value.id,
            gender: this._eventForm.controls['gender'].value.id,
          };
        } else {
          this._eventForm.controls['eventType'].setValue(2);
          data = {
            isClass: false,
            category_description:
              this._eventForm.controls['categoryName'].value.category_description,
            //format_id: this._eventForm.controls['fixtureType'].value.name,
            participant_type_id:
              this._eventForm.controls['participantType'].value.name,
            gender_id: this._eventForm.controls['gender'].value.name,
            //format: this._eventForm.controls['fixtureType'].value.id,
            participant: this._eventForm.controls['participantType'].value.id,
            gender: this._eventForm.controls['gender'].value.id,
            dob_cap: this._eventForm.controls['bornAfter'].value,
          };
        }
        this._categoryClassList[i] = data;
        this._existingCat[i] = data
      }
    }
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
  }

  updateAfterEditViewEvents(item: any) {
  //   this._isEventEditAfterView = false;
  //   for (let i = 0; i < this._categoriesData.length; i++) {
  //   const data = {
  //     category_description: this._ddFlag == 1 ? this._eventForm.controls['categoryName'].value.category_description : this._eventForm.controls['categoryName'].value.name,
  //     participant_type_id: this._ddFlag == 1 ?
  //       this._eventParticipantType.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.participant_type_id)[0].name : this._eventForm.controls['participantType'].value.name,
  //     gender_id: this._ddFlag == 1 ?
  //       this._gender.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.gender_id)[0].name : this._eventForm.controls['gender'].value.name,
  //     participant: this._ddFlag == 1 ?
  //       this._eventForm.controls['categoryName'].value.participant_type_id : this._eventForm.controls['participantType'].value.id,
  //     gender: this._ddFlag == 1 ?
  //       this._eventForm.controls['categoryName'].value.gender_id : this._eventForm.controls['gender'].value.id,
  //     dob_cap: this._ddFlag == 1 ? this._eventForm.controls['bornAfter'].value : '',
  //     category_id : this._ddFlag == 1 ? this._eventForm.controls['categoryName'].value.category_id : ''
      
  //   };
  //   this._categoriesData[i] = data;
  // }
   
    // this._eventForm.controls['eventClass'].setValue('');
    // this._eventForm.controls['gender'].setValue('');
    // this._eventForm.controls['participantType'].setValue('');
    // this._eventForm.controls['bornAfter'].setValue('');
    // this._eventForm.controls['categoryName'].setValue('');
    this._isEventEditAfterView = false;
    
    var data;
    for (let i = 0; i < this._categoriesData.length; i++) {
      if (this._catIndex === i) {
        if (this._ddFlag==1) {
          this._eventForm.controls['eventType'].setValue({
            id: 1,
            typeName: 'Abled',
          });
          data = {
            isClass: true,
            category_description:
            this._eventForm.controls['categoryName'].value.category_description,

            participant_type_id:
            this._eventParticipantType.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.participant_type_id)[0].name,
            gender_id: this._gender.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.gender_id)[0].name,
            //format: this._eventForm.controls['fixtureType'].value.id,
            participant: this._eventForm.controls['categoryName'].value.participant_type_id,
            gender: this._eventForm.controls['categoryName'].value.gender_id,
            dob_cap: this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)),
            category_id : this._eventForm.controls['categoryName']
          };
        } else {
          this._eventForm.controls['eventType'].setValue({
            id: 2,
            typeName: 'Dis-Abled',
          });
          data = {
            isClass: false,
            category_description:
            this._eventForm.controls['categoryName'].value.name,
            //format_id: this._eventForm.controls['fixtureType'].value.name,
            participant_type_id:
              this._eventForm.controls['participantType'].value.name,
            gender_id: this._eventForm.controls['gender'].value.name,
            //format: this._eventForm.controls['fixtureType'].value.id,
            participant: this._eventForm.controls['participantType'].value.id,
            gender: this._eventForm.controls['gender'].value.id,
            dob_cap: this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)),
          };
        }
        this._categoriesData[i] = data;
        this._existingFlag = true;
        this._dob = data.dob_cap
      }
    }
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
  }

  fileDetail(file: any) {
    this.showImage = false;
    //this._notSelectedImage=true;
    const maxSize = 1.5 * 1024 * 1024;
    const minSize = 1.0 * 1024 * 1024;
    if (file[0].size < 15000) {
      // (file[0].size >  maxSize) && (file[0].size <  minSize)
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'Size Image (1980*480) Accepted',
        life: 2000,
      });
    } else {
      this._showBanner = true;
      this._selectedBanner = file.item(0);
      this._uploadImage = this._selectedBanner
      //this._selectedUpdateBanner = this._selectedBanner
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this._selectedBanner = event.target.result;
      };
      reader.readAsDataURL(this._selectedBanner);
    }
  }
  isPublished(data: any) {
    this._isPublished = data.checked;
  }
  closeDialog(data: any) {
  }

  updateEventImage(data: any, formData: any) {
    this.eventsService.updateEventImage(data, formData).subscribe({
      next: (result: any) => {
        if(this._updateEventFlag==true){
          this._uploadImageonUpdate= result.body;
        }
      },
      error: (result) => {
      },
      complete: () => { },
    });
  }
  cancelCreatedEvent() {
    this._showLoader = true;
    var updatedData = {
      event_data: {
        parent_event_id: 0,
        event_name: this._eventDetailForm.controls['eventName'].value,
        level_id: this._eventDetailForm.controls['eventLevel'].value,
        status_id: 5,
        cycle_id: this._eventDetailForm.controls['eventCycle'].value,
        city_id: this._eventDetailForm.controls['eventCity'].value,
        country_id: this._eventDetailForm.controls['eventCountry'].value,
        state_id: this._eventDetailForm.controls['eventState'].value,
        address: this._eventDetailForm.controls['eventAddress'].value,
        event_start_time: this._eventDetailForm.controls['eventStartDate'].value,
        event_end_time: this._eventDetailForm.controls['eventEndDate'].value,
        reg_start_time: this._eventDetailForm.controls['registrationStartDate'].value,
        reg_end_time: this._eventDetailForm.controls['registrationEndDate'].value,
        published: this._eventDetailForm.controls['isPublish'].value,
        event_type: this._eventForm.controls['eventType'].value,
        image_url: this._selectedBanner,
        event_id: this._eventUpdatedData.event_id
      },
      existing_categories: this._existingCat,

    };
    this.eventsService.updateEvents(updatedData).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.resetForm();
        this._categoriesData = [];
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Info',
          detail: 'Event Cancelled',
          life: 3000,
        });
      },
      error: (result) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Some Error Occured',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }

  deleteCreatedEvent() {
    this._showLoader = true;
    this.eventsService.deleteEvents(this._eventUpdatedData.event_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.resetForm();
        this._categoriesData = [];
        this._updateEventFlag = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Event Deleted',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/home/organize']);
                  }, 1000);
      },
      error: (result) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  createAfterView() {
    const data = {
      category_description: this._ddFlag == 1 ? this._eventForm.controls['categoryName'].value.category_description : this._eventForm.controls['categoryName'].value.name,
      participant_type_id: this._ddFlag == 1 ?
        this._eventParticipantType.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.participant_type_id)[0].name : this._eventForm.controls['participantType'].value.name,
      gender_id: this._ddFlag == 1 ?
        this._gender.filter((x: any) => x.id == this._eventForm.controls['categoryName'].value.gender_id)[0].name : this._eventForm.controls['gender'].value.name,
      participant: this._ddFlag == 1 ?
        this._eventForm.controls['categoryName'].value.participant_type_id : this._eventForm.controls['participantType'].value.id,
      gender: this._ddFlag == 1 ?
        this._eventForm.controls['categoryName'].value.gender_id : this._eventForm.controls['gender'].value.id,
      dob_cap: this._ddFlag == 1 ? this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)) : '',
      category_id : this._ddFlag == 1 ? this._eventForm.controls['categoryName'].value.category_id : ''
    };
    if (this._categoriesData.map((x:any)=> x.category_description).includes(this._eventForm.controls['categoryName'].value.name) || 
    (this._categoriesData.map((x:any)=> x.category_description)).includes(this._eventForm.controls['categoryName'].value.category_description))
        {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Duplicate Entry',
            detail: 'Already Exist',
            life: 10000,
          });
          
          
        } else {
          this._categoriesData.push(data);
          this._newCategoriesUpdate.push(data);   
        }
    this._isSubmitEvent = false;
    this._eventForm.controls['eventClass'].setValue('');
    this._eventForm.controls['gender'].setValue('');
    this._eventForm.controls['participantType'].setValue('');
    this._eventForm.controls['bornAfter'].setValue('');
    this._eventForm.controls['categoryName'].setValue('');
    //}
  }
  updateViewedEvents() {
    // if(this._isPublished){
    //   this._showPublish = this._isPublished;
    // }
    // else{
    this._showLoader = true;
    this._existingCategories=[];
    this._existingCategories = this._eventUpdatedData.categories.filter((x:any)=>x.is_active==true);
    if (this._eventDetailForm.valid) {
      for (let i = 0; i < this._newCategoriesUpdate.length; i++) {
        const data = {
          category_description: this._newCategoriesUpdate[i].category_description,
          participant_type_id: this._newCategoriesUpdate[i].participant,
          gender_id: this._newCategoriesUpdate[i].gender,
          dob_cap: this._ddFlag == 1 ? this._newCategoriesUpdate[i].dob_cap : undefined
        };
        this._finalCatClassList.push(data);
      }
      for (let i = 0; i < this._newCategoriesUpdate.length; i++) {
        const dataMaster = {
          category_id: this._ddFlag == 1 ? this._newCategoriesUpdate[i].category_id : undefined,
          dob_cap: this._ddFlag == 1 ? this._newCategoriesUpdate[i].dob_cap : undefined
        };
        this._newMasterCategoriesUpdate.push(dataMaster);
      }
      for (let i = 0; i < this._existingCategories.length; i++) {
        if(this._dob && this._existingFlag==true){
          this._dob = this._dob
        }
        else{
          this._dob = this._eventUpdatedData.categories.map((dob: any) => dob.dob_cap)[0].toString();
        }
        
        
        const existingData = {
          category_description: this._existingCategories[i].category.category_description,
          participant_type_id: this._existingCategories[i].category.participant_type_id,
          gender_id: this._existingCategories[i].category.gender_id,
          category_id: this._existingCategories[i].category.category_id,
          dob_cap: this._ddFlag == 1 ? this._dob : undefined
        };
        this._existingCat.push(existingData);
      }
      if (this._selectedBanner.startsWith('data')) {
        const formData = new FormData();
        formData.append('image', this._uploadImage);
        this.updateEventImage(this._eventUpdatedData.event_id , formData);
      }
      else{
        this._uploadImageonUpdate = this._selectedBanner;
      }
      var updatedData = {
        event_data: {
          parent_event_id: 0,
          event_name: this._eventDetailForm.controls['eventName'].value,
          level_id: this._eventDetailForm.controls['eventLevel'].value,
          status_id: this._eventDetailForm.controls['eventStatus'].value,
          cycle_id: this._eventDetailForm.controls['eventCycle'].value,
          city_id: this._eventDetailForm.controls['eventCity'].value,
          country_id: this._eventDetailForm.controls['eventCountry'].value,
          state_id: this._eventDetailForm.controls['eventState'].value,
          address: this._eventDetailForm.controls['eventAddress'].value,
          event_start_time: this._eventDetailForm.controls['eventStartDate'].value,
          event_end_time: this._eventDetailForm.controls['eventEndDate'].value,
          reg_start_time: this._eventDetailForm.controls['registrationStartDate'].value,
          reg_end_time: this._eventDetailForm.controls['registrationEndDate'].value,
          published: this._eventDetailForm.controls['isPublish'].value,
          event_type: this._ddFlag,
          image_url: this._uploadImageonUpdate,
          event_id: this._eventUpdatedData.event_id,
          role_registration: this._eventDetailForm.controls['accessPermission'].value
        },
        existing_categories: this._existingCat,
        deleted_categories: this.deletedCategoryId.length > 0 ? this.deletedCategoryId : [0],
        new_categories: this._ddFlag == 1 ? undefined: this._finalCatClassList,
        new_master_categories : this._ddFlag == 1 ? this._newMasterCategoriesUpdate : undefined
      };
      this.eventsService.updateEvents(updatedData).subscribe({
        next: (result: any) => {
         
          localStorage.setItem('event', result);
          this._showLoader = false;
          this._showMessage = true;
          this._showUpdateMessage = true;
                  // this.messageService.add({
          //   key: 'bc',
          //   severity: 'success',
          //   summary: 'Info',
          //   detail: 'Event Updated',
          //   life: 3000,
          // });
          
          // setTimeout(() => {
            
          //           }, 2000);
        },
        error: (result) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Something went wrong.',
            detail: result.error.msg,
            life: 3000,
          });

        },
        complete: () => { },
      });
    }

    else {
      this._isSubmitEventDetail = true;

    }
  //}

  }

  goToOffial(){
    this.tabToIndex.emit(1);
  }
  continueToOfficial(){
    this._isPublished=false;
    this._showPublish = false;
    //this._showMessage = true;
    if(this._updateEventFlag==true){
      this.updateViewedEvents();
      
    }
    else{
      this._showPublish = false;
      this._updateEventFlag=false;
      this.creatEvent();
    }
    
  }

  getEntries() {
    this.jsonDataCallingService.getRoles().subscribe({
      next: (result: any) => {
        this._userRoles = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }

  getUpdatedData() {
    this._showLoader = true;
    this._updateEventFlag = true;
    this._eventDetailForm.controls['eventCountry'].setValue(this._eventUpdatedData.country_id);
    this._eventDetailForm.controls['eventState'].setValue(this._eventUpdatedData.state_id);
    this._eventDetailForm.controls['eventCity'].setValue(this._eventUpdatedData.city_id);
    this.getState();
    if (this._stateList.length > 0) {
      this._eventDetailForm.controls['eventCountry'].setValue(this._eventUpdatedData.country_id);
      this._eventDetailForm.controls['eventState'].setValue(this._eventUpdatedData.state_id);
    }

    this.getCityList();
    if (this._cityList.length > 0) {
      this._eventDetailForm.controls['eventCity'].setValue(this._eventUpdatedData.city_id);
    }
    this._ddFlag = this._eventUpdatedData.event_type;

    this._eventDetailForm.controls['eventName'].setValue(this._eventUpdatedData.event_name);
    this._eventDetailForm.controls['eventLevel'].setValue(this._eventUpdatedData.level_id);
    this._eventDetailForm.controls['eventStatus'].setValue(this._eventUpdatedData.status_id);
    this._eventDetailForm.controls['eventCycle'].setValue(this._eventUpdatedData.cycle_id);

    this._eventDetailForm.controls['eventStartDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.event_start_time)));
    this._eventDetailForm.controls['eventEndDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.event_end_time)));
    this._eventDetailForm.controls['registrationStartDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.reg_start_time)));
    this._eventDetailForm.controls['registrationEndDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.reg_end_time)));
    this._eventDetailForm.controls['eventAddress'].setValue(this._eventUpdatedData.address);
    this._eventDetailForm.controls['isPublish'].setValue(this._eventUpdatedData.published);
    this._eventForm.controls['eventType'].setValue(this._eventUpdatedData.event_type);
    this._eventDetailForm.controls['accessPermission'].setValue(this._eventUpdatedData.role_registration);
    this._categories = this._eventUpdatedData.categories.filter((x:any)=>x.is_active==true);
    this._selectedBanner = this._eventUpdatedData.image_url;
    
    
    for (let i = 0; i < this._categories.length ; i++) {
      const dataExisting = {
        category_description: this._categories[i].category.category_description,
        participant_type_id: this._categories[i].category.participant_type_id,
        participant: this._categories[i].category.participant_type_id,
        gender_id: this._categories[i].category.gender_id,
        gender: this._categories[i].category.gender_id,
        category_id: this._categories[i].category.category_id,
        dob_cap: this._ddFlag == 1 ? this._categories[i].dob_cap : ''
      }
      if (dataExisting.gender_id === 1) {
        dataExisting.gender_id = 'Male'
      }
      else if (dataExisting.gender_id === 1) {
        dataExisting.gender_id = 'Female'
      }
      else {
        dataExisting.gender_id = 'Others'
      }
      if (dataExisting.participant_type_id === 1) {
        dataExisting.participant_type_id = 'Single'
      }
      else if (dataExisting.participant_type_id === 2) {
        dataExisting.participant_type_id = 'Teams'
      }
      else if (dataExisting.participant_type_id === 3) {
        dataExisting.participant_type_id = 'Doubles'
      }
      else {
        dataExisting.participant_type_id = 'Mixed-Doubles'
      }
      this._categoriesData.push(dataExisting);
    }
    this._showLoader = false;
  }
  editViewedEvent(itemDetail: any, index: any){
    this._isEventEditAfterView = true
    this._catIndex = index;
    if(this._ddFlag==1){
      this._eventForm.controls['bornAfter'].setValue(new Date(itemDetail.dob_cap));
      this._eventForm.controls['eventType'].setValue({ id: 1, typeName: 'Abled' });
      //this._eventForm.controls['categoryName'].setValue(itemDetail.category_description);
      this._eventForm.controls['categoryName'].setValue(
        this._masterCategoriesList.filter((x: any) => x.category_description == itemDetail.category_description)[0]);

      this._eventForm.controls['gender'].setValue(this._gender.filter((x: any) => x.name == itemDetail.gender_id)[0]);
      this._eventForm.controls['participantType'].setValue(this._eventParticipantType.filter((x: any) => x.name == itemDetail.participant_type_id
      )[0])
    }
    else {
      this._eventForm.controls['categoryName'].setValue(
        this._eventClassList.filter(
          (x: any) => x.name == itemDetail.category_description
        )[0]
      );
      this._eventForm.controls['gender'].setValue(
        this._gender.filter((x: any) => x.name == itemDetail.gender_id)[0]
      );
      this._eventForm.controls['participantType'].setValue(
        this._eventParticipantType.filter(
          (x: any) => x.name == itemDetail.participant_type_id
        )[0]
      );
    }
  }
  getMasterCategories() {
    this.profileMenuService.getMasterCategories().subscribe({
      next: (data: any) => {
        this._masterCategoriesList = data.body;

      },
      error: (data: any) => {

      },
      complete: () => {

      },
    })
  }

  
  getDetailsByEventId(){
    this._updateEventFlag= true;
    this._showSuccess = true;
    this._showMessage = true;
    this._showSuccess = true;
    this.eventsService.getDetailsByEventId().subscribe({
      next: (data: any) => {
        
       var id= this.encyptDecryptService.decryptUsingAES256(
          localStorage.getItem('event_id')
        );
        
       // this._dummyID = localStorage.getItem('event_id')
        var currentData = data.body.filter((x:any) => x.event_id ==  id )[0];
        this._eventUpdatedData = currentData;
        const dd = this.encyptDecryptService.encryptUsingAES256(
          this._eventUpdatedData.event_id.toString()
        );
        localStorage.setItem('event_id', dd);
        this._eventDetailForm.controls['eventCountry'].setValue(currentData.country_id);
        this._eventDetailForm.controls['eventState'].setValue(currentData.state_id);
        this._eventDetailForm.controls['eventCity'].setValue(currentData.city_id);
        this.getState();
        if (this._stateList.length > 0) {
          this._eventDetailForm.controls['eventCountry'].setValue(currentData.country_id);
          this._eventDetailForm.controls['eventState'].setValue(currentData.state_id);
        }
    
        this.getCityList();
        if (this._cityList.length > 0) {
          this._eventDetailForm.controls['eventCity'].setValue(currentData.city_id);
        }
        
    
        this._eventDetailForm.controls['eventName'].setValue(currentData.event_name);
        this._eventDetailForm.controls['eventLevel'].setValue(currentData.level_id);
        this._eventDetailForm.controls['eventStatus'].setValue(currentData.status_id);
        this._eventDetailForm.controls['eventCycle'].setValue(currentData.cycle_id);
        this._eventDetailForm.controls['eventStartDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(currentData.event_end_time)));
        this._eventDetailForm.controls['eventEndDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(currentData.event_end_time)));
        this._eventDetailForm.controls['registrationStartDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(currentData.reg_start_time)));
        this._eventDetailForm.controls['registrationEndDate'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(currentData.reg_end_time)));
        this._eventDetailForm.controls['eventAddress'].setValue(currentData.address);
        this._eventDetailForm.controls['isPublish'].setValue(currentData.published);
        this._eventForm.controls['eventType'].setValue(currentData.event_type);
        this._eventDetailForm.controls['accessPermission'].setValue(currentData.role_registration);
        this._categories = currentData.categories.filter((x:any)=>x.is_active==true);
        this._selectedBanner = currentData.image_url;
        this._ddFlag = currentData.event_type;
        for (let i = 0; i < this._categories.length ; i++) {
          const dataExisting = {
            category_description: this._categories[i].category.category_description,
            participant_type_id: this._categories[i].category.participant_type_id,
            participant: this._categories[i].category.participant_type_id,
            gender_id: this._categories[i].category.gender_id,
            gender: this._categories[i].category.gender_id,
            category_id: this._categories[i].category.category_id,
            dob_cap: this._ddFlag == 1 ? this._categories[i].dob_cap : ''
          }
          if (dataExisting.gender_id === 1) {
            dataExisting.gender_id = 'Male'
          }
          else if (dataExisting.gender_id === 1) {
            dataExisting.gender_id = 'Female'
          }
          else {
            dataExisting.gender_id = 'Others'
          }
          if (dataExisting.participant_type_id === 1) {
            dataExisting.participant_type_id = 'Single'
          }
          else if (dataExisting.participant_type_id === 2) {
            dataExisting.participant_type_id = 'Teams'
          }
          else if (dataExisting.participant_type_id === 3) {
            dataExisting.participant_type_id = 'Doubles'
          }
          else {
            dataExisting.participant_type_id = 'Mixed-Doubles'
          }
          this._categoriesData.push(dataExisting);
        }
      

      },
      error: (data: any) => {

      },
      complete: () => {

      },
    })
  }
  
  
}
