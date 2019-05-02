import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StranaProfilaComponent } from './strana-profila.component';

describe('StranaProfilaComponent', () => {
  let component: StranaProfilaComponent;
  let fixture: ComponentFixture<StranaProfilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StranaProfilaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StranaProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
