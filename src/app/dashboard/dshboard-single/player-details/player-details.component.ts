import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stupa-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
  @Input() data: any;

  ngOnInit(): void {
    console.log(this.data)
  }
  ngOnChanges(){
    this.data
    console.log(this.data)
  }
}
