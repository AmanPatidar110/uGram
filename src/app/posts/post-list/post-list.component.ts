import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
   styleUrls: ['./post-list.component.css']
})
export class postListComponent implements OnInit, OnDestroy{
  isLoading = false;
  totalPosts = 0;
  postPerPage = 5;
  currentPage = 1;
  pagesizeOptions = [1, 2, 5, 10];
  userId: string;

  posts: Post[] = [];
  private postsSubs: Subscription;
  private authListernerSubs: Subscription;
  public userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService) { }

ngOnInit() {


  this.isLoading = true;
  this.postsService.getPosts(this.postPerPage, this.currentPage);



  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authListernerSubs = this.authService
  .getAuthStatusListner()
  .subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();

  });

  this.postsSubs = this.postsService.postsUpdated
  .subscribe((postData: {posts: Post[], maxPostCount: number}) => {
    this.isLoading = false;
    this.posts = postData.posts;
    this.totalPosts = postData.maxPostCount;
  });

  this.userId = this.authService.getUserId();

  console.log(this.userId);

}

onDelete(postId: string) {
  this.isLoading = true;
  this.postsService.deletePost(postId)
    .subscribe(resData => {
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
}

onChangePage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postPerPage = pageData.pageSize;
  this.postsService.getPosts(this.postPerPage, this.currentPage);
}


ngOnDestroy() {
  this.postsSubs.unsubscribe();
  this.authListernerSubs.unsubscribe();

}

};
