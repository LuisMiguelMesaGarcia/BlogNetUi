import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../model/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../model/update-blog-post-model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent {
  id: string | null = null;
  model?: BlogPost
  categories$? : Observable<Category[]>
  selectedCategories?:string[]
  isImageSelectorVisible:boolean = false;

  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;



  constructor(private route:ActivatedRoute, private blogPostService: BlogPostService, private categoryService: CategoryService, private router:Router, private imageService:ImageService){}

  ngOnInit(){
    this.categories$ = this.categoryService.getAllCategories();
    this.route.paramMap.subscribe({
      next: (params)=>{
        this.id = params.get('id');

        //get blogpost from API
        if(this.id){
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next:(res)=>{
              this.model = res;
              this.selectedCategories = res.categories.map(x=> x.id);
            }
          });
        }
        this.imageSelectSubscription = this.imageService.onSelectImage().subscribe({
          next: (res)=>{
            if(this.model){
              this.model.featuredImageUrl = res.url
              this.isImageSelectorVisible = false;
            }
          }
        })

      }
    });
  }

  OnFormSubmit():void{
    if(this.model && this.id){
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? []
      };

      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id,updateBlogPost).subscribe({
        next:(res)=>{
          this.router.navigateByUrl('admin/blogposts');
        },
        error:()=>{}
      })
    }
  }

  openImageSelector(){
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }

  onDelete(){
    if(this.id){
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (res)=>{
          this.router.navigateByUrl('admin/blogposts');
        }
      })
    }
  }

  ngOnDestroy(){
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
