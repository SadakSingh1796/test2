import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.scss'],
})
export class RegisteredComponent implements OnInit {
  @Input() _showDetailsonIcon:any = []
  _players: any = [
  ];
  constructor(
    private eventService: EventsService,
    private encyptDecryptService: EncyptDecryptService,
    public router: Router,private playerService: PlayerServiceService,private messageService: MessageService
  ) {
    
  }
  ngOnInit() {
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._showDetailsonIcon = changes['_showDetailsonIcon'].currentValue;
    console.log(this._showDetailsonIcon)
    //this._players = this._showDetailsonIcon.map((p:any)=>p.players)
  }
}
