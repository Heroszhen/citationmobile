import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModaleditorPage } from './modaleditor.page';

describe('ModaleditorPage', () => {
  let component: ModaleditorPage;
  let fixture: ComponentFixture<ModaleditorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModaleditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
