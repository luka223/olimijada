import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTimaComponent } from './test-tima.component';

describe('TestTimaComponent', () => {
  let component: TestTimaComponent;
  let fixture: ComponentFixture<TestTimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
