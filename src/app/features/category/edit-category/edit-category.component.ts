import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {

  id: string | null = null;
  paramSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  deleteCategorySubscription?: Subscription;
  category?:Category;

  constructor(private route:ActivatedRoute, private categoryService:CategoryService, private _router:Router){}

  ngOnInit(){
    //obtener el id de los parametros
    this.paramSubscription = this.route.paramMap.subscribe({
      next: (params)=>{
        this.id = params.get('id');

        if(this.id){
          this.categoryService.getCategoryById(this.id)
          .subscribe({
            next: (response)=>{
              this.category = response;
            }
          })
        }
      }
    });
  }
  // ngOnInit(){
  //   this.route.params.subscribe(params => {
  //     this.id = params['id'];
  //   });
  // }
  OnFormSubmit(){
    const updateCategoryRequest : UpdateCategoryRequest = {
      name: this.category?.name??'',
      urlHandle: this.category?.urlHandle??''
    };
    if(this.id){
      this.editCategorySubscription = this.categoryService.updateCategory(this.id,updateCategoryRequest).subscribe({
        next:(response)=>{
          this._router.navigateByUrl('/admin/categories')
        }
      });
    }
  }

  OnDelete(){
    if(this.id){
      this.deleteCategorySubscription=this.categoryService.deleteCategory(this.id).subscribe({
        next: (response)=>{
          this._router.navigateByUrl('/admin/categories')
        }
      })
    }
  }

  ngOnDestroy(){
    this.paramSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
    this.deleteCategorySubscription?.unsubscribe();
  }
  
}
