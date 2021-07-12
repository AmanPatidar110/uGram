import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";

import { postCreateComponent } from './post-create/post-create.component';
import { postListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [
    postCreateComponent,
    postListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule { }
