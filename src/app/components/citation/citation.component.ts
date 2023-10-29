import { Component, Input, OnInit } from '@angular/core';
import { ICitation } from 'src/app/interfaces/general';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss'],
})
export class CitationComponent  implements OnInit {
  @Input() citation: ICitation|null = null;
  
  constructor() { }

  ngOnInit() {}

}
