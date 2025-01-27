import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolixyComponent } from './privacy-polixy.component';

describe('PrivacyPolixyComponent', () => {
  let component: PrivacyPolixyComponent;
  let fixture: ComponentFixture<PrivacyPolixyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolixyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPolixyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
