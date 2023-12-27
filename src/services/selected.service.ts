import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-selected';

class SelectedService {
  init() {
    this.upd();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    if (products.length === 0) {
      const element = document.querySelector('.header__buttons .favorite');
      element?.classList.remove('hide');
    }
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    if (products.length === 1 && products[0].id === product.id) {
      const element = document.querySelector('.header__buttons .favorite');
      element?.classList.add('hide');
    } 
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(DB);
    this.upd();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this.upd();
  }

  async isItSelected(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async upd() {
    const products = await this.get();
    const element = document.querySelector('.header__buttons .favorite');
    if (products.length > 0) {
      element?.classList.remove('hide');
    } else {
      element?.classList.add('hide');
    }
  }
}

export const selectedService = new SelectedService();
