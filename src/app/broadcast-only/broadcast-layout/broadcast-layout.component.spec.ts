import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastLayoutComponent } from './broadcast-layout.component';

describe('BroadcastLayoutComponent', () => {
  let component: BroadcastLayoutComponent;
  let fixture: ComponentFixture<BroadcastLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
