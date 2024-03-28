import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

interface CartItem extends Item {
  quantity: number;
  customItem: string;
  customValue: number;
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
  cartItems: Item[] = [];

  selectedItem: Item | undefined; // This will hold the item that was clicked
  cartCount = 0;
  isModalVisible: boolean = false;
  quantity: number = 1;
  totalPrice!: number;
  customItem: string = '';
  customValue: number = 0;
  constructor(private http: HttpClient, private router: Router,private cartService: CartService,private toastr: ToastrService) {


  }

  ngOnInit(): void {
    this.get_store_product_item_list();
    //this.products = this.responseData.products[0].items.filter((item: { is_visible_in_store: any; }) => item.is_visible_in_store);
    this.loadCartItems(); // Load cart items on initialization

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
  // saveCart() {
  //   this.cartService.saveCart(this.selectedItem);
  // }

  saveCart(): void {
    // Load existing cart items
    this.loadCartItems();

    if (!this.selectedItem) {
      this.toastr.error('No item selected to add to cart.', 'Error');
      return;
    }

    // Create a new cart item from the selected item
    const newCartItem: CartItem = {
      ...this.selectedItem,
      quantity: this.quantity,
      customItem: this.customItem,
      customValue: this.customValue,
    };

    // Add the new cart item to the array
   // this.cartItems.push(newCartItem);

    // Save the updated array to local storage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));

    // Show the success message
    this.toastr.success('Item added to cart!', 'Success');

    // Update the cart count
    this.cartCount = this.cartItems.length;

    // Close the modal here using the appropriate method for your UI framework
    // ...
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
  loadCartItems(): void {
    const cartContent = localStorage.getItem('cart');
    this.cartItems = cartContent ? JSON.parse(cartContent) : [];
    this.cartCount = this.cartItems.length; // Update cart count
    console.log(this.cartCount);
  }
  showCartItems(): void {
    // Logic to open the modal and show cartItems
    // This will be specific to how you are handling modals
    // It could be as simple as setting a boolean to show/hide the modal
  }
}
