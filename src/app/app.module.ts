import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StoreloginComponent } from './components/storelogin/storelogin.component';
import { HeadersidebarComponent } from './components/headersidebar/headersidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { CartService } from './services/cart.service';
import { OrderComponent } from './components/order/order.component';
import { OrdercheckoutComponent } from './components/ordercheckout/ordercheckout.component';

@NgModule({
  declarations: [
    AppComponent,
    StoreloginComponent,
    HeadersidebarComponent,
    OrderHistoryComponent,
    CreateOrderComponent,
    OrderComponent,
    OrdercheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),


  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
