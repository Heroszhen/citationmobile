import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalcitationPage } from './modalcitation.page';

describe('ModalcitationPage', () => {
  let component: ModalcitationPage;
  let fixture: ComponentFixture<ModalcitationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalcitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
