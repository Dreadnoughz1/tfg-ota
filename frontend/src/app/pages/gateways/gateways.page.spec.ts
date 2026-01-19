import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewaysPage } from './gateways.page';

describe('GatewaysPage', () => {
  let component: GatewaysPage;
  let fixture: ComponentFixture<GatewaysPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
