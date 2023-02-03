import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastDialogComponent } from './broadcast-dialog.component';

describe('BroadcastDialogComponent', () => {
  let component: BroadcastDialogComponent;
  let fixture: ComponentFixture<BroadcastDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
