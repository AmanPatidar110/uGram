import { NgModule } from "@angular/core";

import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule
  ]

})
export class AngularMaterialModule {}
