import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitationPage } from './citation.page';

describe('CitationPage', () => {
  let component: CitationPage;
  let fixture: ComponentFixture<CitationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
