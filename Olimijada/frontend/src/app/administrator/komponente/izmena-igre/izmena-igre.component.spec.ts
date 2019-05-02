import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmenaIgreComponent } from './izmena-igre.component';

describe('IzmenaIgreComponent', () => {
  let component: IzmenaIgreComponent;
  let fixture: ComponentFixture<IzmenaIgreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzmenaIgreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmenaIgreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
