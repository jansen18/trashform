import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderPage } from './trader.page';

describe('TraderPage', () => {
  let component: TraderPage;
  let fixture: ComponentFixture<TraderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
