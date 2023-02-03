import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MessageService } from 'primeng/api';
import { AllotRankService } from 'src/app/services/allot-rank/allot-rank.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
@Component({
  selector: 'stupa-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [MessageService],
})
export class OrderHistoryComponent {
  _showLoader: boolean = false;
  _eventList: any = [
  ];
  _showRegisered: boolean = false;
  _eventId: number = 0;
  _showDetailsonIcon: any=[];
  constructor(
    private eventService: EventsService,
    private encyptDecryptService: EncyptDecryptService,
    public router: Router,private playerService: PlayerServiceService,private messageService: MessageService
  ) {
    this.getRegisteredParticipants();
  }
  ngOnInit() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getOrderHistoryDetails()
  }
  showDialog(event_details:any) {
    this._showRegisered = true;
    this._showDetailsonIcon = event_details;
    console.log(this._showDetailsonIcon)
  }
  getRegisteredParticipants() {
    // this.eventService.getPlayers(this._eventId,).subscribe({});
  }
  goBack() {
    this.router.navigateByUrl('/home');
  }

  getOrderHistoryDetails(){
      this._showLoader = true;
      this.playerService.getOrderHistory()
          .subscribe({
            next: (result: any) => {
              console.log(result)
              this._showLoader = false;
              console.log(result);
              this._eventList = result.body;
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: 'Order History Fetched Successfully',
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
  }
