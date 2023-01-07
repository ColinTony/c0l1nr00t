import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DevComponent } from './dev/dev.component';
import { HackingComponent } from './hacking/hacking.component';
import { HackingOverflowComponent } from './hacking-overflow/hacking-overflow.component';
import { ContactoComponent } from './contacto/contacto.component';



@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    DevComponent,
    HackingComponent,
    HackingOverflowComponent,
    ContactoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
