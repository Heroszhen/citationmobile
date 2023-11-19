import { Component, Input, OnInit } from '@angular/core';
import { Citation } from 'src/app/models/citation';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent  implements OnInit {
  @Input() modules:any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };
  @Input() citation:Citation|undefined;
  citationM:Citation = new Citation();

  constructor() {}

  ngOnInit(): void {
    if (this.citation !== undefined) {
      this.citationM.assignData(this.citation);
    }
  }

  logChange(e:any): void{
    console.log(e)
  }

  editCitation(): void {
    console.log(this.citationM)
  }
}
