import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatmodal } from './chatmodal';

describe('Chatmodal', () => {
  let component: Chatmodal;
  let fixture: ComponentFixture<Chatmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chatmodal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
