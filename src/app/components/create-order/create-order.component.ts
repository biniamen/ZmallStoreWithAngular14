import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
interface Item {
  _id: string;
  price: number;
  name: string;
  details: string;
  image_url: string[];
  is_available: boolean;
  is_visible_in_store: boolean;
  // ... other properties as needed
}
interface Product {
  items: Item[];
  // ... other properties of Product
}
interface StoreProductsResponse {
  products: Product[];
  // ... other properties of response
}
@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent implements OnInit {
  adminUrl = environment.adminUrl;
  responseData: any;
  itemlist : any
  products: Item[] = [];
  selectedItem: Item | undefined; // This will hold the item that was clicked
  cartCount = 0;
  isModalVisible: boolean = false;
  quantity: number = 1;
  totalPrice!: number;
  constructor(private http: HttpClient, private router: Router,private cartService: CartService) {


  }

  ngOnInit(): void {
    this.get_store_product_item_list();
    //this.products = this.responseData.products[0].items.filter((item: { is_visible_in_store: any; }) => item.is_visible_in_store);
    console.log(this.products)
    this.updateCartCount();
    if (this.selectedItem && this.selectedItem.price) {
      this.updateTotalPrice();
    }

  }

  onSelectItem(item: Item): void {
    this.selectedItem = item;
    // As soon as an item is selected, set the quantity to 1 and calculate the total price
    this.quantity = 1;
    this.totalPrice = this.selectedItem.price;
  }

  get_store_product_item_list() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      server_token: serverToken,
      store_id: storeId,
    };

    // Specify the response type
    this.http.post<StoreProductsResponse>(this.adminUrl + '/store/get_store_product_item_list', payload)
      .subscribe((response: StoreProductsResponse) => { // Use the interface here
        if (response.products && response.products.length > 0 && response.products[0].items) {
          // Only filter if items array is available
          this.itemlist = response.products[0].items.filter(item => item.is_visible_in_store);
        }
        console.log(this.itemlist); // Log the filtered item list
      }, error => {
        console.error('Error fetching store product items:', error);
      });
  }

  toggleCartModal() {
    // Logic to display cart details modal
  }
  updateCartCount() {
    this.cartCount = this.cartService.getCartCount();
  }
  saveCart() {
    this.cartService.saveCart(this.selectedItem);
  }

  increaseQuantity() {
    this.quantity++;
    this.updateTotalPrice();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateTotalPrice();
    }
  }
  updateTotalPrice() {
    if (this.selectedItem) {
      this.totalPrice = this.quantity * this.selectedItem.price;

    }
  }
}
