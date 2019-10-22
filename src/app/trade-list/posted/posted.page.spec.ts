import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedPage } from './posted.page';

describe('PostedPage', () => {
  let component: PostedPage;
  let fixture: ComponentFixture<PostedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
