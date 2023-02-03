import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomVideoEditorComponent } from './custom-video-editor.component';

describe('CustomVideoEditorComponent', () => {
  let component: CustomVideoEditorComponent;
  let fixture: ComponentFixture<CustomVideoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomVideoEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomVideoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
