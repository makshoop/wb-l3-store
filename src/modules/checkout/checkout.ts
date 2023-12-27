import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice, genUUID, sendEvent } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';

const GET_TOTAL_PRICE = (products: ProductData[]) => {
  return products.reduce((acc, product) => (acc += product.salePriceU), 0);
}
class Checkout extends Component {
  products!: ProductData[];

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    const totalPrice = GET_TOTAL_PRICE(this.products);
    this.view.price.innerText = formatPrice(totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

  private async _makeOrder() {
    const payload = {
      productIds: this.products.map(product => product.id),
      totalPrice: GET_TOTAL_PRICE(this.products),
      orderId: genUUID()
    }
    sendEvent('purchase', {...payload});
    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    window.location.href = '/?isSuccessOrder';
  }
}

export const checkoutComp = new Checkout(html);
