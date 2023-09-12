import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { ShippingsComponent } from '../components/shippings/shippings.component';
import { ShippingNewComponent } from '../components/shipping-new/shipping-new.component';
import { CameraComponent } from '../components/camera/camera.component';
import { ShippingListComponent } from '../components/shipping-list/shipping-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage,ShippingsComponent, ShippingNewComponent, CameraComponent, ShippingListComponent]
})
export class TabsPageModule {}
