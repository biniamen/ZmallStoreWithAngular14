// cart.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() {
    this.loadCart();
  }

  addToCart(item: any) {
    this.cart.push(item);
   // this.saveCart(selectedItem: any);
  }

  getCartItems() {
    return this.cart;
  }

  getCartCount() {
    return this.cart.length;
  }

  saveCart(selectedItem: any) {
    localStorage.setItem('cart', JSON.stringify(selectedItem));
  }

  loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart = JSON.parse(cartData);
    }
  }

  // Methods for updating and removing items will go here
}
