import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-pros-guidelines',
  templateUrl: './pros-guidelines.component.html',
  styleUrls: ['./pros-guidelines.component.scss'],
  providers: [MessageService]
})
export class ProsGuidelinesComponent implements OnInit {
  fileToUpload: any;
  fileName: any;
  pdfUrl: any;
  _eventId: any;
  _uploadImage: any;
  @Output() tabIndex = new EventEmitter<number>();
  getProspectusUrl: any;
  _updateFlag: boolean = false;
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private messageService: MessageService) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getProspectus();
  }
  onFileDropped($event: any) {
    
    this.uploadFilesSimulator($event);
  }
  uploadFilesSimulator(file: FileList) {
    this.fileToUpload = file.item(0);
    this._uploadImage = file.item(0);

    this.fileName = file[0].name;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.pdfUrl = event.target.result;
    };
    reader.addEventListener('load', () => { });
    reader.readAsDataURL(this.fileToUpload);
    this.updateProspectus();
  }
  fileBrowseHandler(files: any) {
    this.onFileDropped(files);
    // (files[0].type != 'image/png'
    // this.uploadFilesSimulator(files);
    // alert("clicked")
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  updateProspectus() {
    
    const formData = new FormData();
    formData.append('image', this._uploadImage)
    this.eventsService.updateProspectus(formData, this._eventId).subscribe({
      next: (data: any) => {

      },
      error: (result: any) => {

        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => console.info('complete')
    })

  }
  reset() {
    this.pdfUrl = false;
  }

  getProspectus(){
    this._updateFlag = true;
    this.getProspectusUrl = localStorage.getItem('event_data');
    const newProspectusUrl = JSON.parse(this.getProspectusUrl);
    if(newProspectusUrl!=null){
      this.pdfUrl = newProspectusUrl.prospectus;
    }
    else{
      this.pdfUrl = false;
    }
  }

}
