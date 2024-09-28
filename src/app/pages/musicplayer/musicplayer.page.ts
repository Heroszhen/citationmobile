import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.page.html',
  styleUrls: ['./musicplayer.page.scss'],
})
export class MusicplayerPage {
  folder:string = "Documents"
  str:string = "";
  constructor() { }

  ionViewWillEnter(): void {
    this.getMusicFiles();
  }

  async getMusicFiles() {
    try {
      const result = await Filesystem.readdir({
        path: this.folder, // Adjust this path based on where your music files are stored
        directory: Directory.ExternalStorage, // Use External to access the shared storage
      });
    
      this.str = JSON.stringify(result.files);
    } catch (error:any) {
      this.str = error
    }
    
  }
}
