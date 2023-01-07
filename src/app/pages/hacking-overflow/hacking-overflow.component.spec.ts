import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackingOverflowComponent } from './hacking-overflow.component';

describe('HackingOverflowComponent', () => {
  let component: HackingOverflowComponent;
  let fixture: ComponentFixture<HackingOverflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HackingOverflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackingOverflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
