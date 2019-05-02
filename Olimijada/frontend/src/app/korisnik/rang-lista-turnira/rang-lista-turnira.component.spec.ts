import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangListaTurniraComponent } from './rang-lista-turnira.component';

describe('RangListaTurniraComponent', () => {
  let component: RangListaTurniraComponent;
  let fixture: ComponentFixture<RangListaTurniraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangListaTurniraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangListaTurniraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
