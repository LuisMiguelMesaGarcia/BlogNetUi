import { Component } from '@angular/core';
import { AddBlogPost } from '../model/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent {
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  isImageSelectorVisible:boolean = false;
  imageSelectorSubscription?: Subscription;
  
  constructor(private blogPostService: BlogPostService, private _router:Router, private categoryService: CategoryService, private imageService: ImageService){
    this.model = {
      title:'',
      shortDescription:'',
      content:'',
      featuredImageUrl:'',
      urlHandle:'',
      author:'',
      publishedDate:new Date(),
      isVisible:true,
      categories:[]
    }
  }

  ngOnInit(){
    this.categories$ = this.categoryService.getAllCategories();
    this.imageSelectorSubscription = this.imageService.onSelectImage().subscribe({
      next:(selectedImage)=>{
        this.model.featuredImageUrl = selectedImage.url;
        this.closeImageSelector();
      }
    })
  }

  OnFormSubmit(){
    console.log(this.model)
    this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response)=>{
        this._router.navigateByUrl('/admin/blogposts');
      }
    });
  }

  openImageSelector(){
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(){
    this.imageSelectorSubscription?.unsubscribe();
  }
}
