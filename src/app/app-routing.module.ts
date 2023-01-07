import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { DevComponent } from './pages/dev/dev.component';
import { HackingComponent } from './pages/hacking/hacking.component';
import { HackingOverflowComponent } from './pages/hacking-overflow/hacking-overflow.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

const routes: Routes = [
  {
    path:'home',
    title:'Home - c0l1nr00t',
    component:HomeComponent
  },
  {
    path:'about',
    title:'About - c0l1nr00t',
    component:AboutComponent
  },
  {
    path:'dev',
    title:'Developer - c0l1nr00t',
    component:DevComponent
  },
  {
    path:'hacking',
    title:'Ethical Hacking - c0l1nr00t',
    component:HackingComponent
  },
  {
    path:'hacking-overflow',
    title:'Hacking Overflow - c0l1nr00t',
    component:HackingOverflowComponent
  },
  {
    path:'contacto',
    title:'Contacto - c0l1nr00t',
    component:ContactoComponent
  },
  {
    path:"**",
    redirectTo:'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
