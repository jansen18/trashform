import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTabPage } from './history-tab.page';

describe('HistoryTabPage', () => {
  let component: HistoryTabPage;
  let fixture: ComponentFixture<HistoryTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
