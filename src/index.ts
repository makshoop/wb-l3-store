import './icons';
import Router from './router';
import { cartService } from './services/cart.service';
import { userService } from './services/user.service';

(async function bootstrap() {
  await userService.init();
  cartService.init();

  new Router();
  console.log('router');

  setTimeout(() => {
    document.body.classList.add('is__ready');
  }, 250);
})();