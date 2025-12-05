import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticketmodal } from './ticketmodal';

describe('Ticketmodal', () => {
  let component: Ticketmodal;
  let fixture: ComponentFixture<Ticketmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ticketmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ticketmodal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
