import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  _participantType: any;
  _participantTypeList: any = [];
  event_id: any = '';
  _categories: any = [];
  @Input() _eventId: any;
  _showLoader: boolean = false;
  _teamCategories: any = [];
  _doubblesCategories: any = [];
  _mixDoubbleCategories: any = [];
  _eventTitle: any = '';
  _loadComponents: boolean = false;
  _participant_Id: any;
  _pageMainTitle: string = 'Add Participants and Categories';
  _pageSubTitle: string = 'To Proceed Further you must add some category in this event and There should be some Players associated with you.';
  constructor(private eventService: EventsService, private messageService: MessageService, private encyptDecryptService: EncyptDecryptService) { }
  ngOnInit(): void {
    this._eventTitle = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('ev_nm'));
    this.getParticipantAndCategory();
  }
  getParticipantAndCategory() {
    this._showLoader = true;
    this.eventService.getParticipantTypeAndCategories(this._eventId).subscribe({
      next: (data: any) => {
        this._participantTypeList = data.body;
        this._showLoader = false;
        if (data.body.length > 0) { /*use same parameter for passing categories to different components */
          this._loadComponents = true;
          this._participantType = data.body[0];
          this._categories = data.body[0].categories;
        }
      },
      error: (result) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
        });
      },
      complete: () => {

      },
    });
  }
  participantclick(event: any) {
    if (event.participant_type_id === 1) {
      this._participant_Id = 1;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 2) {
      this._participant_Id = 2;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 3) {
      this._participant_Id = 3;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 4) {
      this._participant_Id = 4;
      this._categories = event.categories;
    }
  }
}
