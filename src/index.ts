import "./icons";
import Router from "./router";
import { cartService } from "./services/cart.service";
import { selectedService } from "./services/selected.service";
import { userService } from "./services/user.service";

new Router();
cartService.init();
userService.init();
selectedService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
