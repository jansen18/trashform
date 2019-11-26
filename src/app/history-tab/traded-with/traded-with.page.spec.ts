import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradedWithPage } from './traded-with.page';

describe('TradedWithPage', () => {
  let component: TradedWithPage;
  let fixture: ComponentFixture<TradedWithPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradedWithPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradedWithPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
