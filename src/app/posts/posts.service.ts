import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { title } from "process";
import { Subject } from "rxjs";
import { map } from "rxjs/operators"

import { environment } from "../../environments/environment"
import { Post } from "./post.model";

const BACKEND_DOMAIN = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class PostsService {

  private posts: Post[] = [];
  public postsUpdated = new Subject<{ posts: Post[], maxPostCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, maxPostCount: number }>( BACKEND_DOMAIN + "/feeds/posts" + queryParams)
      .pipe(map(resData => {
        return {
          posts: resData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPostCount: resData.maxPostCount
        };
      }))
      .subscribe(transformedData => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({
            posts: [...this.posts],
            maxPostCount: transformedData.maxPostCount
          });
      });
  }

  getPost(postId) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(BACKEND_DOMAIN + "/feeds/post/" + postId);
  }


  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_DOMAIN + "/feeds/post", postData)
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }


  deletePost(postId: string) {
    return this.http.delete(BACKEND_DOMAIN + `/feeds/post/${postId}`)
  }

  updatePost(post: Post, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: image,
        creator: null
      }
    }

    this.http
      .put(BACKEND_DOMAIN + "/feeds/post/" + post.id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const postIndex = updatedPosts.findIndex(p => p.id === post.id);

        // const updatedPost: Post = {
        //   id: post.id,
        //   title: post.title,
        //   content: post.content,
        //   imagePath: ""
        // }

        // updatedPosts[postIndex] = updatedPost;
        // this.posts = updatedPosts;

        this.router.navigate(['/']);
      });
  }
}
