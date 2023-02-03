import { Component, Input, SimpleChanges, TemplateRef } from '@angular/core';
import { NgttRound, NgttTournament } from '../interfaces';

@Component({
  selector: 'stupa-fix-single-tree',
  templateUrl: './fix-single-tree.component.html',
  styleUrls: ['./fix-single-tree.component.scss']
})
export class FixSingleTreeComponent {
  @Input() matchTemplate!: TemplateRef<any>;
  @Input() tournament!: NgttTournament;

  public winnersBracket!: NgttRound[];
  public final: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('tournament') && changes.tournament.currentValue) {
      this.winnersBracket = this.tournament.rounds.filter((round:any) => {
        return round.type === 'Winnerbracket';
      });
    }
    this.final = this.tournament.rounds.filter((round:any) => {
      return round.type === 'Final';
    }).shift();
  }
}
