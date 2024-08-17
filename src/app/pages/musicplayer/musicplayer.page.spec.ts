import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicplayerPage } from './musicplayer.page';

describe('MusicplayerPage', () => {
  let component: MusicplayerPage;
  let fixture: ComponentFixture<MusicplayerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MusicplayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
