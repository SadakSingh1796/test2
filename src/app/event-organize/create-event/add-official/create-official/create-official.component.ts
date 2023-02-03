import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
const TEMPLATE = "assets/file/Import-Official-Template.xlsx";
@Component({
  selector: 'stupa-create-official',
  templateUrl: './create-official.component.html',
  styleUrls: ['./create-official.component.scss'],
})
export class CreateOfficialComponent implements OnInit {
  @Output() landPage = new EventEmitter<any>();
  _officialForm: any = FormGroup;
  _defaultProfile = '../../../../assets/icons/avatar.png';
  _profileImage: any;
  _isSubmit: boolean = false;
  _imageFile = null;
  _showMessage: boolean = false;
  _state = [{ name: 'Abled' }, { name: 'dis-Abled' }];
  constructor(private formBuilder: FormBuilder) {
    this.loadOfficialForm();
  }
  ngOnInit(): void { }
  loadOfficialForm() {
    this._officialForm = this.formBuilder.group({
      officialName: new FormControl('', Validators.compose([Validators.required])),
      officialRole: new FormControl('', Validators.compose([Validators.required])),
      // officialCountry: new FormControl('', Validators.compose([Validators.required])),
      officialState: new FormControl('', Validators.compose([Validators.required])),
      officialEmail: new FormControl('', Validators.compose([Validators.required])),
      officialPhoto: new FormControl('', Validators.compose([])),
      // officialCountryCode: new FormControl('', Validators.compose([Validators.required])),
      // officialPhone: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  resetForm() {
    this._isSubmit = false;
    this._officialForm.reset();
    this._showMessage = false;
  }
  AddOfficial() {
    this._isSubmit = true;
    if (this._officialForm.valid) {
      this._showMessage = true;
      this.resetForm();
    }
  }
  onUpload(e: any) {
    let userImageFile = e.dataTransfer
      ? e.dataTransfer.files[0]
      : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (userImageFile.type.match(pattern)) {
      reader.onload = this._handleReaderLoaded.bind(this);
      this._imageFile = userImageFile;
      reader.readAsDataURL(userImageFile);
    } else {
      alert('Wrong Pattern');
    }
  }
  _handleReaderLoaded(e: any) {
    var reader = e.target;

    this._defaultProfile = reader.result;
  }

  downloadTemplate() {
    const link = document.createElement('a');
    link.setAttribute('target', '_self');

    link.setAttribute('href', TEMPLATE);
    link.setAttribute('download', `add_official_template.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  goBackLandPage(){
    this.landPage.emit(false);
  }
}
