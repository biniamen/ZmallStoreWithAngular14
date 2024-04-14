import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreloginComponent } from './components/storelogin/storelogin.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: '/orderhistory', pathMatch: 'full' },
  { path: 'login', component: StoreloginComponent },
  { path: 'orderhistory', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  { path: 'create_order', component: CreateOrderComponent, canActivate: [AuthGuard]},
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
