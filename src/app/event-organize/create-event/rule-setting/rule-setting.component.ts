import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RulesSettingService } from 'src/app/services/rulesSetting/rules-setting.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MessageService } from 'primeng/api';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rule-setting',
  templateUrl: './rule-setting.component.html',
  styleUrls: ['./rule-setting.component.scss'],
  providers: [MessageService]
})
export class RuleSettingComponent implements OnInit {
  _ruleSettingForm!: FormGroup;
  _cities = [
    { name: 'Event' },
    { name: 'Category & Class' }
  ]
  _eventFlag = true;
  _categoryClassList: any
  _rulesCard = false;
  _showAddButton = false;
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,

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

  };
  _standardCardPoint: any;
  _reAssignedValue: any;
  _reAssignedScore: any;
  _reAssignFlag: boolean | undefined;
  _showSuccessMsg: boolean | undefined;
  _showIndex = false;
  _updateText = false;
  button: boolean | undefined;
  _closeCard = false;
  _ruleItems: any = [
    {
      id: 1,
      name: '1',
      isActive: false
    },
    {
      id: 2,
      name: '3',
      isActive: false
    }
    ,
    {
      id: 3,
      name: '5',
      isActive: true
    },
    {
      id: 4,
      name: '7',
      isActive: false
    }
  ];

  _currentRuleValue: any = '';
  _categories: any;
  _categoriesObject: any;
  _gender: any;
  _genderValue: any;
  _eventFixtureFormat: any;
  _eventParticipantType: any;
  _participantValue: any;
  _fixtureValue: any;
  addCategoryList = false;
  _showValues = false;
  _newArray: any;
  _currentCategoryRuleValue: any;
  _rules: any;
  _points: any;
  event: any;
  newCategoriesArray: any = [];
  _showLoader: boolean = false;
  @Output() tabIndex = new EventEmitter<number>();
  
  constructor(private formBuilder: FormBuilder,
    private rulesService: EventsService, private messageService: MessageService,
    private rulesSetting: RulesSettingService, private jsonDataCallingService: JsonDataCallingService,
    private encyptDecryptService: EncyptDecryptService, private router: Router) {
    this._ruleSettingForm = this.formBuilder.group({
      scoreCard: new FormControl('5', Validators.required),
      pointSystem: new FormControl('1', Validators.required),
      reassignPoints: new FormControl('Standard Point', Validators.required),
      reassignScoreCard: new FormControl('5', Validators.required),
    });
  }



  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.button = false;
    this.getGender();
    this.eventsParticipant();
    this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;
  }



  selectRuleType(event: any) {
    if (event.value.name === 'Event') {
      this._eventFlag = true;
    }
    else {
      this._eventFlag = false;
      this.selectcategoryClass();
    }

  }
  selectcategoryClass() {
    this._showLoader = true;
    this.rulesSetting.getRulesCategory(this.event).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this._categoryClassList = data.body;
        this._categories = this._categoryClassList.map((cat: any) => cat.categories);
        this._categoriesObject = this._categories[0].map((cat: any) => cat.category);
        this._genderValue = this._gender.filter((x: any) => x.id == this._categoriesObject[0].gender_id)[0].name
        this._participantValue = this._eventParticipantType.filter((x: any) => x.id == this._categoriesObject[0].participant_type_id)[0].name
        this._rules = this._categories[0].map((rule: any) => rule.rule_set) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 5
        this._points = this._categories[0].map((rule: any) => rule.rule_point) === null ? this._categories[0].map((rule: any) => rule.rule_set) : 'Standard Point'
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Some Error Occured',
          life: 3000,
        });
      },
      complete: () => {

      }
    })

  }
  updateRules() {
    this._showLoader = true;
    const rule_point = this._ruleSettingForm.controls['pointSystem'].value;
    const rule_set = this._currentRuleValue===""? 5 : this._currentRuleValue;
    this.rulesSetting.updateRules(this.event, rule_set, rule_point).subscribe({

      next: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });

      },
      error: (result) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: result.body.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }

  reassignCard(index: any) {
    for (let i = 0; i < this._categoriesObject.length; i++) {
      if (index == i) {
        this._categoriesObject[i].addCategoryList = true;
      } else {
        this._categoriesObject[i].addCategoryList = false;
      }
    }
    this._rulesCard = true;
    this._showValues = true;
    this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;

  }

  updateScoreCard(index: any) {
    this._showLoader = true;
    this.rulesService.addCategoryClass().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._categoryClassList = result;
        result[index].addCategoryList = true;
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },

    });

  }
  getValues(data: any, index: any) {
    this._categoryClassList[index].addCategoryList = true;
    this._reAssignFlag = true;
    this._updateText = true;
    if (this._ruleSettingForm.controls['reassignPoints'].value)
      this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;
  }
  closeCard(index: any) {

    this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
    this._reAssignedScore = this._ruleSettingForm.controls['reassignScoreCard'].value;
    this._rulesCard = false;
    this._categoriesObject[index].addCategoryList = false;
  }
  currentRule(data: any, index: any) {
    this._currentRuleValue = data.name;
    for (let i = 0; i < this._ruleItems.length; i++) {

      if (index == i) {
        this._ruleItems[i].isActive = true;
      } else {
        this._ruleItems[i].isActive = false;
      }
    }

  }

  currentCategoryRule(data: any, index: any) {
    this._currentCategoryRuleValue = data.name;
    for (let i = 0; i < this._ruleItems.length; i++) {
      if (index == i) {
        this._ruleItems[i].isActive = true;
      } else {
        this._ruleItems[i].isActive = false;
      }
    }
  }
  updateCard(index: any,item:any) {
    console.log(item,this._categoriesObject)
    this._rulesCard = false;
    for (let i = 0; i < this._categoriesObject.length; i++) {
      if (index == i) {
        this._categoriesObject[i]._updatedCardValue = true;
        this._reAssignedValue = this._ruleSettingForm.controls['reassignPoints'].value;
        this._reAssignedScore = this._currentCategoryRuleValue;
      } else {
        this._categoriesObject[i]._updatedCardValue = false;
      }
    }
    const updatedCategoryRules =
    {
      categories: [{
        category_id: item.category_id,
        rule_point: this._reAssignedValue === "Golden Point" ? 2 : 1,
        rule_set: parseInt(this._reAssignedScore),
      }]

    }
    this.newCategoriesArray.push(updatedCategoryRules)
    this.rulesSetting.updateCategoryRules(this.event, updatedCategoryRules).subscribe({

      next: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Category Updated',
          life: 3000,
        });

      },
      error: (result) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'SOme Error Occured',
          life: 3000,
        });
      },
      complete: () => { },
    })


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

  eventsParticipant() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;
      },
      error: (result) => { },
      complete: () => { },
    });
  }
  updateCategory() {
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  reset(){
    this._ruleSettingForm.controls['pointSystem'].setValue("1");
    this._ruleItems[2].isActive = true;
    this._ruleItems[0].isActive = false;
    this._ruleItems[1].isActive = false;
    this._ruleItems[3].isActive = false;
  }
}
