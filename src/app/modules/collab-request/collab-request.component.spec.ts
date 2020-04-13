import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CollabRequestComponent} from './collab-request.component';

describe('CollabRequestComponent', () => {
  let component: CollabRequestComponent;
  let fixture: ComponentFixture<CollabRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollabRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
