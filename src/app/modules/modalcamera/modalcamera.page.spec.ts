import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalcameraPage } from './modalcamera.page';

describe('ModalcameraPage', () => {
  let component: ModalcameraPage;
  let fixture: ComponentFixture<ModalcameraPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalcameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
