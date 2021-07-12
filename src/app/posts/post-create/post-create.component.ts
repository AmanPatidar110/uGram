import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class postCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  private authStatusSubs: Subscription;
  post: Post;
  form: FormGroup;
  imagePreview: string;
  isLoading = false;

  constructor(public postService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe( authStatus => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),

      'content': new FormControl(null, { validators: [Validators.required] }),

      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          console.log(this.post);

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true
    const post: Post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: null,
      creator: null
    }

    if (this.mode == 'create') {
      this.postService.addPost(post, this.form.value.image);
    } else {
      this.postService.updatePost(post, this.form.value.image);
    }

    this.form.reset();
    console.log(this.form);
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

}
