import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreloginComponent } from './components/storelogin/storelogin.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: StoreloginComponent },
  { path: 'orderhistory', component: OrderHistoryComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
