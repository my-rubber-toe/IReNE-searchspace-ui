import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CollabrequestComponent} from './collabrequest.component';

describe('CollabRequestComponent', () => {
  let component: CollabrequestComponent;
  let fixture: ComponentFixture<CollabrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollabrequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
