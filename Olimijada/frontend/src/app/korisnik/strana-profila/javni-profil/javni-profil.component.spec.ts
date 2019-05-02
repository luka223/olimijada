import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavniProfilComponent } from './javni-profil.component';

describe('JavniProfilComponent', () => {
  let component: JavniProfilComponent;
  let fixture: ComponentFixture<JavniProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavniProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavniProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
