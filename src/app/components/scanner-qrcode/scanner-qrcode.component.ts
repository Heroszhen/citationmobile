import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { wait } from 'src/app/utils/generalUtil';

@Component({
  selector: 'app-scanner-qrcode',
  templateUrl: './scanner-qrcode.component.html',
  styleUrls: ['./scanner-qrcode.component.scss'],
})
export class ScannerQrcodeComponent  implements OnInit, AfterViewInit {
  @Input() modalCtrl: ModalController;
  content:string = "";
  @Output('sendCode') sendCode: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    //this.modalCtrl.dismiss()
    this.startScan();
  }

  async ngAfterViewInit(): Promise<void> {
    await wait(3);
    this.moveVideo();
  }

  async startScan() { 
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });
  
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    //BarcodeScanner.hideBackground();
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      this.content = result.content;
      this.close();
    }
  };

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

  close() {
    document.querySelector('body')?.classList.remove('scanner-active');
    this.stopScan();
    //this.sendCode.emit(this.content);
    this.modalCtrl.dismiss({
      'dismissed': true,
      'content': this.content
    });
  }

  moveVideo() {
    //let section = document.getElementById("scanner-qrcode");
    let video = document.querySelector("video");
    let div = video?.parentElement;
    // section?.appendChild(div as Node);
    // console.log(div)
    if(div && div.style)div.style.zIndex = '999';
    document.querySelector('body')?.classList.add('scanner-active');
  }
}
