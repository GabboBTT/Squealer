import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideMenuComponent } from './component/side-menu/side-menu.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { MonitoringComponent } from './component/monitoring/monitoring.component';
import { CreateMessageComponent } from './component/create-message/create-message.component';
import { SettingsComponent } from './component/settings/settings.component';
import { GraphicsComponent } from './component/graphics/graphics.component';

const routes: Routes = [
  { path : '', component: SideMenuComponent, children: [  
    { path: '', redirectTo: 'edit-profile', pathMatch: 'full'},
    { path: 'edit-profile', component: EditProfileComponent },
    { path: 'monitoring', component: MonitoringComponent },
    { path: 'create-message', component: CreateMessageComponent },
    { path: 'graphics', component: GraphicsComponent },
    { path: 'settings', component: SettingsComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
