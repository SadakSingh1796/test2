import { Component, EventEmitter, HostListener, OnInit, Output, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { CommonSvgMsgComponent } from 'src/app/shared/common-svg-msg/common-svg-msg.component';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { GifLoaderComponent } from 'src/app/shared/gif-loader/gif-loader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'stupa-day-planner',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonSvgMsgComponent,
    GifLoaderComponent,
    ToastModule
  ],
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss'],
  providers: [MessageService],
})
export class DayPlannerComponent implements OnInit {
  _repeat: any = [{}, {}, {}, {}];
  _startTime: any;
  _endTime: any;
  _startTimeAfterBreak: any
  _endTimeAfterBreak: any
  innerWidth: any
  _dateAtFirstTime: any="";
  _currentDateIndex: any="";
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _eventId: any;
  @Output() tabIndex = new EventEmitter<number>();
  _eventUpdatedData: any;
  _start_Date: any;
  _start_Month: any;
  _end_Date: any
  _end_Month: any
  _monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  _dayDifference: any;
  _daysList: any = [];
  _dayPlannerForm!: FormGroup;
  _currentDate: any;
  _isSubmit: boolean = false;
  _showLoader: boolean = false;
  _officialList: any = [];
  _timeDifference: any;
  _totalMatchs: any;
  _officialForEvent: any = [];
  _slotList: any = [];
  _currentOfficial: any = [];
  _eventPlannerDates: any = [];
  _dateModel: any;
  _currentPlannerId: any;
  _deletedSlotList: any = [];
  _tableCount: any = [
    {
      name: '',
      dropDownDetails: []
    }
  ];
  _setStartDate: any = "";
  _isUpdate: boolean = false;
  constructor(private encyptDecryptService: EncyptDecryptService,
    private formBuilder: FormBuilder, private eventsService: EventsService, private messageService: MessageService) {
    this._dateModel = new Date()
    this.loadForm();
    this.innerWidth = window.innerWidth;
    this._eventUpdatedData = localStorage.getItem('event_data');
    this._eventUpdatedData = JSON.parse(this._eventUpdatedData);
    this.getEventOfficial();
    if (this._eventUpdatedData !== null) {
      this._currentDate = new Date(this._eventUpdatedData.event_start_time);
      this._start_Date = new Date(this._eventUpdatedData.event_start_time).getDate();
      this._start_Month = this._monthNames[new Date(this._eventUpdatedData.event_start_time).getMonth()];
      this._end_Date = new Date(this._eventUpdatedData.event_end_time).getDate();
      this._end_Month = this._monthNames[new Date(this._eventUpdatedData.event_end_time).getMonth()];
      // this.countDays(new Date(this._eventUpdatedData.event_start_time), new Date(this._eventUpdatedData.event_end_time))
    }
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getPlannerDates();
    this.getEventOfficial();

    
    
  }
  ngOnChanges(change :SimpleChange){
    this.getEventOfficial();
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  // countDays(start: any, end: any) {
  //   start = new Date(start);
  //   this._dayDifference = Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / (1000 * 60 * 60 * 24));
  //   for (let i = 0; i <= this._dayDifference; i++) {
  //     const data = {
  //       dayCount: 'Day' + (i + 1),
  //       dayDate: this._start_Date + i,
  //       isSelectedDay: i == 0 ? true : false,
  //       date: this.today(this._eventUpdatedData.event_start_time, i)
  //     }
  //     // this._daysList.push(data);
  //   }


  // }
  // today(i: any, value: any) {
  //   var today = new Date();
  //   var dd = today.getDate() + 1;
  //   var mm = today.getMonth() + 1;
  //   var yyyy = today.getFullYear();
  //   var nextDay = new Date(i);
  //   nextDay.setDate(new Date(i).getDate() + 1);

  //   return nextDay.setDate(new Date(i).getDate() + value);
  // }
  countTime(start: any, end: any) {

    if (start !== null && end !== null) {
      var diff = (start.getTime() - end.getTime()) / 1000;
      diff /= (60);
      return Math.abs(Math.round(diff));
    } else {
      return 0;
    }


  }
  loadForm() {
    this._dayPlannerForm = this.formBuilder.group({
      start_time: new FormControl('', Validators.compose([Validators.required])),
      end_time: new FormControl('', Validators.compose([Validators.required])),
      break_start_time: new FormControl('', Validators.compose([Validators.required])),
      break_end_time: new FormControl('', Validators.compose([Validators.required])),
      umpires: new FormControl('', Validators.compose([Validators.required])),
      tables: new FormControl('', Validators.compose([Validators.required])),
      matches: new FormControl('',),
      match_duration: new FormControl(30, Validators.compose([Validators.required])),

    });
  }
  timeValidator(control: FormControl) {
    if (control.value <= this._dayPlannerForm.controls['start_time'].value || control.value >= this._dayPlannerForm.controls['end_time'].value.value) {
      return { time: true };
    }
    return null;
  }
  getPlannerDates() {
    if(this._eventId !=undefined || this._eventId !=null){
    this._showLoader = true;
    this.eventsService.getPlannerDates(this._eventId).subscribe({
      next: (result: any) => {
        this._daysList = [];
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            dayCount: 'Day' + (i + 1),
            dayDate: result.body[i].day.split('T')[0].split('-')[2] + this._monthNames[result.body[i].day.split('T')[0].split('-')[1] - 1],
            isSelectedDay: i == 0 ? true : false,
            planner_id: result.body[i].intervals.length > 0 ? result.body[i].planner_id : 0,
            dayDateFromBackEnd: result.body[i].day
          }
          this._daysList.push(data);
        }
        this._showLoader = false;
        this._dateAtFirstTime = result.body[0].day.split("T")[0];
        this._currentDateIndex= result.body[0].day;
        this.getEventPlannerDetails(this._daysList[0].planner_id)

      },
      error: (result: any) => {
        this._showLoader = false;
      },
      complete: () => {

      },
    })
  }
  }
  updatePlan() {
    if (this._currentPlannerId == 0) {
      this.createEventPlanner();
    } else {
      this.updateDayPlanner();
    }
  }
  createEventPlanner() {
    // this._showLoader = true;
    
    
    //Start: Convert Start and End Date, get Time only
    //var startDate = new Date(this._dayPlannerForm.controls['start_time'].value);
    //var startDate = ;
    //let startTime = JSON.stringify(startDate)
    //startTime = startTime.slice(11, 20)
    //End: Convert Start and End Date, get Time only
    //  var EndDate = new Date(this._dayPlannerForm.controls['end_time'].value);
    //  let endTime = JSON.stringify(EndDate)
    //  endTime = endTime.slice(11, 20)
    if (this._dayPlannerForm.valid) {
    if(this._dayPlannerForm.controls['start_time'].value <= this._dayPlannerForm.controls['end_time'].value || 
    this._dayPlannerForm.controls['end_time'].value >= this._dayPlannerForm.controls['start_time'].value){
      this._showLoader = true;
      this._isSubmit = false;
      
      this._slotList=[]
    for (let i = 0; i < this._officialForEvent.length; i++) {
      const data = {
        "table": (i + 1),
        "umpire_id": this._officialForEvent[i].user_id,
        "umpire_name": this._officialForEvent[i].name
      }
      this._slotList.push(data);
    }

      this._setStartDate===""?this._dateAtFirstTime:this._setStartDate
      console.log(this._setStartDate)
      if(this._setStartDate===""){
        this._setStartDate = this._dateAtFirstTime;
        this._currentDate = this._currentDateIndex
      }
      else{
        this._setStartDate = this._setStartDate;
        this._currentDate = this._currentDate
      }
      const data = {
        "planner": {
          "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
          "date":this._currentDate,
          "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
          "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
          "break_start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_start_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
          "break_end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_end_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
          "umpires": this._dayPlannerForm.controls['umpires'].value,
          "tables": parseInt(this._dayPlannerForm.controls['tables'].value),
          "matches": this._totalMatchs,
          "match_duration": parseInt(this._dayPlannerForm.controls['match_duration'].value)
        },
        "slots": this._slotList
      }
      this.eventsService.createDayPlanner(data).subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: data.body.msg,
            life: 3000,
          });
          this.getEventPlannerDetails(data.body.planner_id);
          
        },
        error: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Success',
            detail: result.error.msg,
            life: 3000,
          });
          
        },
        complete: () => {

        },
      })
    }
      else{
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill StartTime/EndTime in correct format',
          life: 3000,
        });
      }
    }
    else{
      this._isSubmit = true;
    }
  }
  resetForm() {
    this._isSubmit = false;
    this._dayPlannerForm.reset();
    this._officialForEvent = [];
    this.getEventOfficial();
  }
  getEventOfficial() {
    if(this._eventId != undefined){
    this._showLoader = true;
    this.eventsService.getEventOfficial(this._eventId, true).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._officialList = [];
        this._officialList = result.body;
        this._dayPlannerForm.controls['umpires'].setValue(this._officialList.length);
      },
      error: (result) => {
        this._showLoader = false;
      },
      complete: () => { },
    })
  }
  }
  calculateMatches() {
  }
  onSelect(event: any, formControlName: any) {
    if (formControlName == 'start_time') {
      const diff = this.countTime(this._dayPlannerForm.controls['start_time'].value, this._dayPlannerForm.controls['end_time'].value)
      this._totalMatchs = Math.round(Math.abs(Math.round(diff)) / this._dayPlannerForm.controls['match_duration'].value)
    } else if (formControlName == 'end_time') {
      const diff = this.countTime(this._dayPlannerForm.controls['start_time'].value, this._dayPlannerForm.controls['end_time'].value)
      this._totalMatchs = Math.round(Math.abs(Math.round(diff)) / this._dayPlannerForm.controls['match_duration'].value)
    }
  }
  onDurationChange() {
    this._totalMatchs = [];
    this.onTableSelection()
    const diff = this.countTime(this._dayPlannerForm.controls['start_time'].value, this._dayPlannerForm.controls['end_time'].value)
    this._totalMatchs = Math.round(Math.abs(Math.round(diff)) / this._dayPlannerForm.controls['match_duration'].value)
  }
  selectedOfficial(data: any, index: any) {
    this._tableCount
    // this._officialList.splice(this._officialList.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    const dd = {
      "table": (this._tableCount.length + 1),
      "umpire_id": data.value.user_id,
      "umpire_name": data.value.name
    }
    // this._tableCount[index].dropDownDetails = [];
    // this._tableCount[index].dropDownDetails = dd;

    // if (this._tableCount[index].dropDownDetails.findIndex((x: any) => x.umpire_id == data.value.user_id) == -1) {
    //   this._tableCount[index].dropDownDetails.push(dd);
    // }
    // if (this._slotList.findIndex((x: any) => x.umpire_id == data.value.user_id) == -1) {
    //   this._slotList.push(dd);
    // }
    if (this._officialForEvent.findIndex((x: any) => x.user_id == data.value.user_id) == -1) {
      this._officialForEvent.push(data.value);
    } else {
      // this._officialForEvent.splice(this._officialForEvent.findIndex((x: any) => x.user_id == data.value.user_id), 1)
    }

    //this._currentOfficial = [];
  }
  currentDateSelected(index: any) {
    this._tableCount = [];
    for (let i = 0; i < this._daysList.length; i++) {
      if (index == i) {
        this._setStartDate = this._daysList[i].dayDateFromBackEnd.split('T')[0];
        this._currentDate = this._daysList[i].dayDateFromBackEnd
        if (this._daysList[i].planner_id !== 0) {

          // this._setStatrtDate = Moment(this._daysList[i].dayDateFromBackEnd).utc().format('YYYY-MM-DD')
          this.getEventPlannerDetails(this._daysList[i].planner_id)
        } else {
          this._isSubmit = false;
          this._dayPlannerForm.reset();
          this.getEventPlannerDetails(this._daysList[i].planner_id)
        }
        this._daysList[i].isSelectedDay = true;
      } else {
        this._daysList[i].isSelectedDay = false;
      }
    }
  }
  removeOfficial(data: any) {
    this._officialForEvent.splice(this._officialForEvent.findIndex((x: any) => x.user_id == data.user_id), 1)
    this._officialList.push(data)
  }
  getEventPlannerDetails(planner_id: any) {
    this.getEventOfficial();
    if (planner_id !== 0) {
      this._isUpdate = true;
      this._currentPlannerId = planner_id;
      this._showLoader = true;
      this.eventsService.getEventPlannerDetails(this._eventId, planner_id).subscribe({
        next: (result: any) => {
          this._dayPlannerForm.controls['start_time'].setValue(new Date(result.body[0].start_time))
          this._dayPlannerForm.controls['end_time'].setValue(new Date(result.body[0].end_time))
          this._dayPlannerForm.controls['break_start_time'].setValue(new Date(result.body[0].break_start_time))
          this._dayPlannerForm.controls['break_end_time'].setValue(new Date(result.body[0].break_end_time))
          this._dayPlannerForm.controls['umpires'].setValue(result.body[0].umpires)
          this._dayPlannerForm.controls['tables'].setValue(result.body[0].tables)
          this._dayPlannerForm.controls['matches'].setValue(result.body[0].matches)
          this._dayPlannerForm.controls['match_duration'].setValue(result.body[0].match_duration)
          this._showLoader = false;
          this._officialForEvent = [];
          this._totalMatchs = result.body[0].matches
          for (let i = 0; i < result.body[0].slots.length; i++) {
            const data = {
              "slot_id": result.body[0].slots[i].slot_id,
              "umpire_id": 184,
              "table": 1,
              "planner_id": 4,
              "umpire_name": result.body[0].slots[i].umpire_name,
              "name": result.body[0].slots[i].umpire_name,
              "user_id": result.body[0].slots[i].umpire_id,
              "dropV": this._officialList[this._officialList.findIndex((x: any) => x.user_id == result.body[0].slots[i].umpire_id)]
            }
            // this._officialList.splice(this._officialList.findIndex((x: any) => x.user_id == result.body[0].slots[i].umpire_id), 1)
            this._officialForEvent.push(data)
          }

        },
        error: (result: any) => {
          this._showLoader = false;

        },
        complete: () => { },
      });
    } else {
      this._isUpdate = false;
      this._currentPlannerId = 0;
      this._officialForEvent = [];
      this._totalMatchs = 0;
      this.getEventOfficial();
      this._dayPlannerForm.reset();
    }

  }
  updateDayPlanner() {
    if (this._dayPlannerForm.valid) {
      if(this._dayPlannerForm.controls['start_time'].value <= this._dayPlannerForm.controls['end_time'].value || 
      this._dayPlannerForm.controls['end_time'].value >= this._dayPlannerForm.controls['start_time'].value){
        this._showLoader = true;
        this._isSubmit = false;
    
        this._slotList = [];
    for (let i = 0; i < this._officialForEvent.length; i++) {
      const data = {
        "table": (i + 1),
        "umpire_id": this._officialForEvent[i].user_id,
        "umpire_name": this._officialForEvent[i].name,
        "slot_id": this._officialForEvent[i].slot_id == undefined ? 0 : this._officialForEvent[i].slot_id
      }
      this._slotList.push(data);
    }
    if(this._setStartDate===""){
      this._setStartDate = this._dateAtFirstTime;
      this._currentDate = this._currentDateIndex
    }
    else{
      this._setStartDate = this._setStartDate;
      this._currentDate = this._currentDate
    }
    const data = {
      "planner": {
        "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
        "date": this._currentDate,
        // "start_time": this._setStartDate + 'T' + this._dayPlannerForm.controls['start_time'].value,
        // "end_time": this._setStartDate + 'T' + this._dayPlannerForm.controls['end_time'].value,
        "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
        "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
        "break_start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_start_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
        "break_end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_end_time'].value.toString().split("GMT")[0].slice(16, 24) + "Z",
        "umpires": this._dayPlannerForm.controls['umpires'].value,
        "tables": this._dayPlannerForm.controls['tables'].value,
        "matches": this._totalMatchs,
        "match_duration": this._dayPlannerForm.controls['match_duration'].value,
        "planner_id": this._currentPlannerId
      },
      "slots": this._slotList,
      "deleted_slots": this._deletedSlotList
    }
    this.eventsService.updateDayPlanner(data).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: data.body.msg,
          life: 3000,
        });
        this.getEventPlannerDetails(this._currentPlannerId);
      },
      error: (data: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: data.error.msg,
          life: 3000,
        });
       
      },
      complete: () => {

      },
    })
  }
  else{
    this.messageService.add({
      key: 'bc',
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill StartTime/EndTime in correct format',
      life: 3000,
    });
  }
}
else{
  this._isSubmit = true;
}
  }
  //generate number of tables(slots) 
  onTableSelection() {
    this.getEventOfficial();
    this._tableCount = [];
    var count;
    if (this._dayPlannerForm.controls['umpires'].value > this._dayPlannerForm.controls['tables'].value) {
      count = this._dayPlannerForm.controls['tables'].value;
    }
    else {
      count = this._dayPlannerForm.controls['umpires'].value;
    }
    for (let i = 0; i < count; i++) {
      const data = {
        name: '',
        dropDownDetails: []
      }
      this._tableCount.push(data);
    }
  }
}
