import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoggedOutComponent } from './home-logged-out.component';

describe('HomeLoggedOutComponent', () => {
  let component: HomeLoggedOutComponent;
  let fixture: ComponentFixture<HomeLoggedOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoggedOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoggedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
