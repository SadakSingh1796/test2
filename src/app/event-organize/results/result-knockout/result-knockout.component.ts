import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-result-knockout',
  templateUrl: './result-knockout.component.html',
  styleUrls: ['./result-knockout.component.scss'],
  providers: [MessageService],
})
export class ResultKnockoutComponent implements OnInit{
 _showLoader: boolean=false;
 _eventId: any;
 _matchDetailsList: any = [];
 @Input() _currentCategoryId: any;
 _searchTeams :any=''
  _matchDetailsListCopy: any=[];
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,private fixtureService: FixtureServiceService,
  ) {
    
  }

  ngOnInit(): void {
    this._currentCategoryId
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getKnockoutTournament(this._eventId,this._currentCategoryId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._currentCategoryId
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getKnockoutTournament(this._eventId,this._currentCategoryId);
  }

   
  
  

  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._matchDetailsList = result.body.reverse();
        this._matchDetailsListCopy = result.body;
      },
      error: (result: any) => {
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
  searchGroups(){
    this._matchDetailsList = this._matchDetailsListCopy.filter((item: any) => {
      return (
        item.round.toLowerCase().includes(this._searchTeams.toLowerCase()));
    });
    console.log(this._matchDetailsList)
  }
 
}

