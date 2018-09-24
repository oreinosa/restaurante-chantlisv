import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderService } from './uploader.service';
import { UploaderComponent } from './uploader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UploaderComponent],
  exports: [UploaderComponent],
  providers: [UploaderService]
})
export class UploaderModule { }
