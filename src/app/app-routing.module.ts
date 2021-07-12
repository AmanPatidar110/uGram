import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router"
import { AuthGuard } from "./auth/auth.guard";
import { postCreateComponent } from "./posts/post-create/post-create.component";
import { postListComponent } from "./posts/post-list/post-list.component";

const routes:Routes = [
  {path: '', component: postListComponent},
  {path: 'create', component: postCreateComponent, canActivate:[AuthGuard]},
  {path: 'edit/:postId', component: postCreateComponent, canActivate:[AuthGuard]},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
