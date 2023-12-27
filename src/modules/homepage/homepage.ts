import { addElement, observeProducts } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { SearchTips } from '../searchTips/searchTips';
import { SearchTip } from 'types';

class Homepage extends Component {
  popularProducts: ProductList;
  searchTips: SearchTips;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);

    this.searchTips = new SearchTips();
    this.searchTips.attach(this.view.tips);
  }

  render() {
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);

        observeProducts(products);
      });

    // логика должна будет перейти в компонент SearchBar
    
    const tips: SearchTip[] = [{text: 'чехол iphone 13 pro', link: ''}, {text: 'коляска agex', link: ''}, {text: 'ноутбук asus', link: ''}] // fetch
    
    setTimeout(() => this.searchTips.update(tips), 2000);

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
