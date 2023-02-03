import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'stupa-recently-deleted',
  templateUrl: './recently-deleted.component.html',
  styleUrls: ['./recently-deleted.component.scss']
})
export class RecentlyDeletedComponent implements OnInit {
  _playerList: any = [];
  @Output() landPage = new EventEmitter<any>();
  goBackLandPage() {
    this.landPage.emit(false);
  }
  ngOnInit(): void {
  }
}
