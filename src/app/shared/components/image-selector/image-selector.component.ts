import { Component, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent {
  private file?: File;
  fileName : string = '';
  title : string = '';

  images$?:Observable<BlogImage[]>;

  @ViewChild('form', {static: false}) imageUploadForm?: NgForm;

  constructor(private imageService: ImageService){

  }

  ngOnInit(){
    this.getImages()
  }

  onFileUploadChange(event: Event){
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage(){
    if(this.file && this.fileName !== '' && this.title !== ''){
      this.imageService.uploadImage(this.file,this.fileName,this.title).subscribe({
        next:(res)=>{
          this.imageUploadForm?.resetForm();
          this.getImages();
        },
        error:()=>{

        }
      });
    }
  }

  selectImage(image: BlogImage){
    this.imageService.selectImage(image);
    
  }

  private getImages(){
    this.images$ = this.imageService.getAllImages();
  }

}
