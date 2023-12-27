import { Component } from '../component';
import { ProductList } from '../productList/productList';
import html from './selectedProducts.tpl.html';
import { selectedService } from '../../services/selected.service';

class SelectedProducts extends Component {
  productList!: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.selected);
  }
  async render() {
    const products = await selectedService.get()

    if (products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.productList.update(products);

    // this.productList.update(products);

    // this.productList.forEach((product) => {
    //   const productComp = new Product(product, { isHorizontal: true });
    //   productComp.render();
    //   productComp.attach(this.view.cart);
    // });

    // const totalPrice = this.productList.reduce((acc, product) => (acc += product.salePriceU), 0);
    // this.view.price.innerText = formatPrice(totalPrice);

    // this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

//   private async _makeOrder() {
//     await cartService.clear();
//     fetch('/api/makeOrder', {
//       method: 'POST',
//       body: JSON.stringify(this.productList)
//     });
//     window.location.href = '/?isSuccessOrder';
//   }
}

export const selectedProducts = new SelectedProducts(html);
