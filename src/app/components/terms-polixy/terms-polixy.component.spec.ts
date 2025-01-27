import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPolixyComponent } from './terms-polixy.component';

describe('TermsPolixyComponent', () => {
  let component: TermsPolixyComponent;
  let fixture: ComponentFixture<TermsPolixyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsPolixyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsPolixyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
