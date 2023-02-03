import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AllotRankService } from 'src/app/services/allot-rank/allot-rank.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-allot-rank-pointers',
  templateUrl: './allot-rank-pointers.component.html',
  styleUrls: ['./allot-rank-pointers.component.scss'],
  providers: [MessageService],
})
export class AllotRankPointersComponent implements OnInit {
  _rankPointerForm!: FormGroup;
  event: any;
  @Output() tabIndex = new EventEmitter<number>();
  _selectedFixtureFormat: any = null;
  _display: any;
  _selectedParticipantTypes: any;
  _isSubmitRankPoints:boolean = false;
  _showLoader: boolean = false;
  _rankArray: any=[];
  _showPoints: boolean = false;
  _rounds: any = [];
  constructor(public encyptDecryptService: EncyptDecryptService,private registrationService: EventsService,
    private messageService: MessageService, private allotRankService: AllotRankService,private formBuilder: FormBuilder,) {
      this.loadRankPointerForm()
    }

  ngOnInit() {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantAndCategories();
  }

  loadRankPointerForm() {
    this._rankPointerForm = this.formBuilder.group({
      _category: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  
  eventClicked() {
    this.tabIndex.emit();
    
  }
  getParticipantAndCategories(){
    if(this.event != undefined || this.event!=null){
    this.registrationService.getParticipantTypeAndCategories(this.event)
    .subscribe({
      next: (result: any) => {
        this._selectedFixtureFormat = result.body;
        this._selectedParticipantTypes = this._selectedFixtureFormat.map(
          (pd: any) => pd.participant_description
        );
        this._display = this._selectedFixtureFormat[0].categories;
      },
      error: () => {},
      complete: () => {},
    });
  }
  } 
  showRegistrations(e: any) {
    if (e === 'Singles') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Singles'
      )[0].categories;
    } else if (e === 'Team') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Team'
      )[0].categories;
    } else if (e === 'Doubles') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Doubles'
      )[0].categories;
    } else {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Mix Doubles'
      )[0].categories;
    }
  }
  allotRankPointers(){
    if (this._rankPointerForm.valid) {
      this._showLoader = true;
      this._rankArray = []
      this._isSubmitRankPoints = false;

      for(let i=0;i< this._rounds.length;i++){
        const data = {
              rank_level: this._rounds[i].round_level,
              points: this._rounds[i].points=== null ? 0 : this._rounds[i].points,
            }
            this._rankArray.push(data)
          }
        const _allotedRankPointers={
          event_id: this.event,
          category_id: this._rankPointerForm.controls['_category'].value,
          ranks : this._rankArray
        }
      this.allotRankService.updateRankPointers(_allotedRankPointers)
        .subscribe({
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
          error: (result:any) => {
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
  else{
  this._isSubmitRankPoints = true;
  this.messageService.add({
    key: 'bc',
    severity: 'error',
    summary: 'Error',
    detail: "Please select the category",
    life: 3000,
  });
  }
}
  getRounds(){
    //this._showLoader = true;
    this._showPoints = true;
    const categoryId = this._rankPointerForm.controls['_category'].value;
    this.allotRankService.getRounds(this.event,categoryId)
        .subscribe({
          next: (result: any) => {
            console.log(result)
            //this._showLoader = false;
            this._rounds = result.body;
            // this.messageService.add({
            //   key: 'bc',
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: 'Points fetched successfully',
            //   life: 3000,
            // });
          },
          error: (result:any) => {
            //this._showLoader = false;
            // this.messageService.add({
            //   key: 'bc',
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: result.error.msg,
            //   life: 3000,
            // });
          },
          complete: () => { },
        });
    
  }
  reset(){
    this._rankPointerForm.reset();
    this._showPoints = false;
  }
}
