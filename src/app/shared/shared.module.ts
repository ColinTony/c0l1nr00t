import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarComponent } from './menubar/menubar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MenubarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    MenubarComponent
  ]
})
export class SharedModule { }
