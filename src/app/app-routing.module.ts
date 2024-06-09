import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreloginComponent } from './components/storelogin/storelogin.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderComponent } from './components/order/order.component';
import { OrdercheckoutComponent } from './components/ordercheckout/ordercheckout.component';
import { StoreProfileComponent } from './components/store-profile/store-profile.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { SettingComponent } from './components/setting/setting.component';

const routes: Routes = [
  { path: '', redirectTo: '/orderhistory', pathMatch: 'full' },
  { path: 'login', component: StoreloginComponent },
  { path: 'orderhistory', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  { path: 'create_order', component: CreateOrderComponent, canActivate: [AuthGuard]},
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
  { path: 'checkout', component: OrdercheckoutComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: StoreProfileComponent, canActivate: [AuthGuard]},
  { path: 'delivery-list', component: DeliveryListComponent, canActivate: [AuthGuard]},
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
