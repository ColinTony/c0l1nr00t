import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarComponent } from './menubar/menubar.component';



@NgModule({
  declarations: [
    MenubarComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MenubarComponent
  ]
})
export class SharedModule { }
