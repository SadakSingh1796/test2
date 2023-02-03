import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  providers: [MessageService],
})
export class RegistrationFormComponent implements OnInit {
  _participantType: any;
  _fixtureFormat: any = [
    { name: 'Singles', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Double', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];

  _selectedFixtureFormat: any = null;
  _display: any;
  _registrationFee: any;
  _updateFlag: boolean | any;
  _selectedParticipantTypes: any;
  event_id: any;
  @Output() tabIndex = new EventEmitter<number>();
  updatedData: any;
  constructor(
    private registrationService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService
  ) {}
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantAndCategories();
  }
  getParticipantAndCategories(){
    if(this.event_id != undefined || this.event_id !=null){
    this.registrationService.getParticipantTypeAndCategories(this.event_id)
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
  enableRegistration(e: any) {
  }
  updateRegistrationFee(category_data: any) {
    const finalData = [];
    for (let i = 0; i < category_data.length; i++) {
      var data = {
        category_id: category_data[i].category_id,
        price: category_data[i].price,
        published: category_data[i].published,
      };
      finalData.push(data);
    }
    const updatedParticipantCategory = {
      category_data: finalData,
    };
    this.registrationService
      .updateRegistrationFees(updatedParticipantCategory, this.event_id)
      .subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result) => {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => {},
      });
  }

  priceChange(i: any) {}
  eventClicked() {
    this.tabIndex.emit();
  }
  reset() {
    this.getParticipantAndCategories();
  }
}
