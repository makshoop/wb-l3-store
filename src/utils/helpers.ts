import { ProductData } from "types";

export const genUUID = () => {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

export const addElement = (parent: HTMLElement, tag: string, options?: object) => {
  const element = document.createElement(tag) as HTMLElement;

  if (options) Object.assign(element, options);

  parent.appendChild(element);

  return element;
};

export const formatPrice = (price: number) => {
  return (
    Math.round(price / 1000)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
  );
};

export const sendEvent = (eventType: string, payload: any): Promise<boolean> => {
  const event = {
    type: eventType,
    payload: payload,
    timestamp: Date.now()
  };

  return fetch('/api/sendEvent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(response => response.ok)
    .catch(() => false);
};

export const viewCardEvent = (product: ProductData) => {
  const { log, ...payload } = product;
  const eventType = log ? 'viewCardPromo' : 'viewCard';

  fetch(`/api/getProductSecretKey?id=${product.id}`)
  .then((res) => res.json())
  .then((secretKey) => {
    sendEvent(eventType, { ...payload, secretKey })
    .then(success => {
      if (success) {
        console.log('Event sent successfully.');
      } else {
        console.log('Failed to send event.');
      }
    });
  });
};

export function observeProducts(products: ProductData[]) {
  const elements = document.querySelectorAll('a.product')
      
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
     if (entry.isIntersecting) {
          // Элемент попал в поле зрения
        console.log('Элемент виден');
        const product = products.find(product => () => {
          const href = entry.target.getAttribute('href');
          if (href) {
              const elId = new URLSearchParams(href).get('id');
              if (!elId) return false;
              return product.id === +elId;
          }          
          return false;   
        });
                      
        if (product) viewCardEvent(product)
          // Добавьте здесь свой код для обработки попадания элемента в поле зрения
        } 
      })
    })
    elements.forEach((el) => {
      observer.observe(el);
    })
}