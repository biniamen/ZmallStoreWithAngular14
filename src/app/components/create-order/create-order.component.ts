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
  quantity: number; // This line is important. Add it if it's missing.

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
  product_name: string;
  quantity: number;
  customItem: string;
  customValue: number;
  totalPrice?: number;
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
  newIncommingOrder: any = []
  selectedItem: Item | undefined; // This will hold the item that was clicked
  cartCount = 0;
  isModalVisible: boolean = false;
  quantity: number = 1;
  totalPrice!: number;
  customItem: string = '';
  customValue: number = 0;
  isSidebarVisible = false;  // This controls the visibility of the sidebar
  totalCartPrice: number = 0;  // This will hold the total price of the cart



  constructor(private http: HttpClient, private router: Router,private cartService: CartService,private toastr: ToastrService) {


  }

  ngOnInit(): void {
    this.get_store_product_item_list();
    this.calculateTotalCartPrice()
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
    console.log()
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


  updateCartCount() {
    this.cartCount = this.cartService.getCartCount();
  }
  // saveCart() {
  //   this.cartService.saveCart(this.selectedItem);
  // }

  showCartItems(): void {
    if (this.cartCount > 0) {
      this.isSidebarVisible = !this.isSidebarVisible; // Toggle visibility
    }
  }

  hideCartItems(): void {
    this.isSidebarVisible = false;
  }
  saveCart(): void {
    // Load existing cart items
    this.loadCartItems();

    if (!this.selectedItem) {
      this.toastr.error('No item selected to add to cart.', 'Error');
      return;
    }
    // const newCartItem: CartItem = {
    //   ...this.selectedItem,
    //   quantity: this.quantity,
    //   customItem: this.customItem,
    //   customValue: this.customValue,
    // };
    // Create a new cart item from the selected item
    const newCartItem: CartItem = {
      ...this.selectedItem,
      product_name :this.selectedItem.name,
      quantity: this.quantity,
      customItem: this.customItem,
      customValue: this.customValue,
    };

    // Calculate total price for the new cart item
    const totalPrice = this.selectedItem.price * this.quantity;
    newCartItem['totalPrice'] = totalPrice; // Add total price to the cart item

    // Add the new cart item to the array
    this.cartItems.push(newCartItem);

    // Save the updated array to local storage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));

    // Show the success message
    this.toastr.success('Item added to cart!', 'Success');

    // Update the cart count
    this.cartCount = this.cartItems.length;
    console.log(this.cartCount)

    // Optionally: Update UI to display new cart count and items
  }

  increaseQuantity() {
    this.quantity++;
    this.updateTotalPrice();
  }

  increaseQuantityCart() {
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
  // getting cart from localStorage
  loadCartItems(): void {
    const cartContent = localStorage.getItem('cart');
    // Make sure that we have an array from the parsed JSON, or else initialize it as an empty array
    this.cartItems = cartContent ? JSON.parse(cartContent) : [];
    if (!Array.isArray(this.cartItems)) { // Check if the parsed content is an array
      this.cartItems = []; // Reset to an empty array if it's not
      this.calculateTotalCartPrice();
    }
    this.cartCount = this.cartItems.length; // Update cart count
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.calculateTotalCartPrice();
    }
  }

  // calculateTotalPrice(): void {
  //   this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // }

  onSelectProduct(product: any): void {
    this.cartService.addToCart({ ...product, quantity: 1 });
    this.loadCartItems();
  }
  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
    this.loadCartItems();
  }

  // Token Checking and new order is comming
  store_notify_new_order() {
    const storeId = localStorage.getItem('store_id');
    const serverToken = localStorage.getItem('server_token');
    const payload = {
      store_id: storeId,
      server_token: serverToken,
    };
   this.http.post(this.adminUrl + 'store/store_notify_new_order', payload).subscribe(response => {
      this.newIncommingOrder = response;
      console.log(this.newIncommingOrder);
    });
  }

  /// cart item
  incrementQuantity(item: any) {
    item.quantity++;
    this.calculateTotalCartPrice();
    this.updateCartItem(item);
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotalCartPrice();
      this.updateCartItem(item);
    }
  }
  updateCartItem(item: any) {
    // Update the cart item in the array
    // Calculate the total price for the individual item
    //item.price = item.quantity * item.price;
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
  calculateTotalCartPrice() {
    this.totalCartPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }



  removeItem(itemToRemove: any) {
    this.cartItems = this.cartItems.filter(item => item !== itemToRemove);
    this.calculateTotalCartPrice();
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
  checkout() {
    this.router.navigate(['/checkout']);
  }
}
