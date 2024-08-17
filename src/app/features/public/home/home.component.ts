import { Component } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/model/blog-post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  blogs$?:Observable<BlogPost[]>;

  constructor(private blogPostService: BlogPostService){
  
  }

  ngOnInit(){
    this.blogs$ = this.blogPostService.getAllBlogPost();
  }

}
