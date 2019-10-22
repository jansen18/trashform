import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeListPage } from './trade-list.page';

describe('TradeListPage', () => {
  let component: TradeListPage;
  let fixture: ComponentFixture<TradeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
