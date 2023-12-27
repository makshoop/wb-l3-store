import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice, sendEvent } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { selectedService } from '../../services/selected.service';
import { userService } from '../../services/user.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);

    this.view.btnFav.onclick = this._addToSelected.bind(this);


    const isInCart = await cartService.isInCart(this.product);

    const isItSelected = await selectedService.isItSelected(this.product);

    if (isInCart) this._setInCart();

    if (isItSelected) this._setIsSelected(true);

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts', {
        headers: {
          'x-userid': userService.getUserId() || ''
        }
      })
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;
    
    cartService.addProduct(this.product);
    this._setInCart();
  }

  private async _addToSelected() {
    if (!this.product) return;
    const isItSelected = await selectedService.isItSelected(this.product);

    if (isItSelected) {
      selectedService.removeProduct(this.product);
    } else {
      selectedService.addProduct(this.product);
    }
    this._setIsSelected(!isItSelected);
    selectedService.clear();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
    if (this.product) {
      sendEvent('addToCart', {...this.product});
    }
  }

  private _setIsSelected(add: boolean) {
    if (add) {
      this.view.heart.classList.add('hide');
      this.view.heartFill.classList.remove('hide');
    }
    else {
      this.view.heart.classList.remove('hide');
      this.view.heartFill.classList.add('hide');
    }

  }
}

export const productDetailComp = new ProductDetail(html);
