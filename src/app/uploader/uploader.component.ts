import { Component, OnInit, Input } from '@angular/core';
import { UploaderService } from './uploader.service';
import { Subject } from 'rxjs';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  @Input() imageURL: string;
  image: any;

  constructor(
    private uploadService: UploaderService,
  ) { }

  ngOnInit() {
  }

  previewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageURL = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  onSubmit(route: string, id: string) {
    // this.logger.log(this.image);
    return this.uploadService
      .uploadFile(route, id, this.image)
      .then((a: UploadTaskSnapshot) => {
        console.log(a);
        return a.ref.getDownloadURL();
      })
      .catch(() => this.image = null);
  }

  onUpdate(route: string = '', id: string) {
    // this.logger.log(this.image);
    return this.uploadService
      .updateFile(route, this.image)
      .then(a => {
        console.log(a);
        return a;
      })
      .then(a => a.downloadURL)
      .catch(() => this.image = null);
  }

}