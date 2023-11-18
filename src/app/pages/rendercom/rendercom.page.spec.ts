import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RendercomPage } from './rendercom.page';

describe('RendercomPage', () => {
  let component: RendercomPage;
  let fixture: ComponentFixture<RendercomPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RendercomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
