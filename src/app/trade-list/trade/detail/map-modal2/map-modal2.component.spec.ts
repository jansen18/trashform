import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapModal2Component } from './map-modal2.component';

describe('MapModal2Component', () => {
  let component: MapModal2Component;
  let fixture: ComponentFixture<MapModal2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapModal2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapModal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
