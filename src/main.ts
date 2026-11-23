import './scss/styles.scss';
import { ProductModel } from './components/Model/ProductModel';
import { BasketModel } from './components/Model/BasketModel';
import { BuyerModel } from './components/Model/BuyerModel';
import { Api } from './components/base/Api';
import { ApiShop } from './components/Api/ApiShop';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { ContactsForm } from './components/View/ContactsForm';
import { OrderForm } from './components/View/OrderForm';
import { Gallery } from './components/View/Gallery';
import { IProduct, TPayment } from './types';
import { Success } from './components/View/Success';

const events = new EventEmitter();

const productsModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basket = new Basket(events, cloneTemplate<HTMLElement>('#basket'));
const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const success = new Success(events, cloneTemplate<HTMLElement>('#success'));
const cardPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
  onClick: () => events.emit('preview:button'),
});

const api = new Api(API_URL);
const apiShop = new ApiShop(api);

function getBasketData() {
  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
      onClick: () => events.emit('card:remove', item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  return { items, total: basketModel.getTotal() };
}

function renderOrderForm() {
  const { payment, address } = buyerModel.getData();
  const errors = buyerModel.validate();
  orderForm.render({
    payment,
    address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join('; '),
  });
}

function renderContactsForm() {
  const { email, phone } = buyerModel.getData();
  const errors = buyerModel.validate();
  contactsForm.render({
    email,
    phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join('; '),
  });
}

events.on('catalog:changed', () => {
  const cards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
    });
  });
  gallery.render({ catalog: cards });
});

events.on('card:select', (item: IProduct) => {
  productsModel.setPreview(item);
});

events.on('preview:button', () => {
  const item = productsModel.getPreview()
  if (!item) return;
  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item);
  } else {
    basketModel.addItem(item);
  }
  modal.close();
});

events.on('preview:changed', () => {
  const item = productsModel.getPreview();
  if (!item) return;

  const noPrice = item.price === null;
  const inBasket = basketModel.hasItem(item.id);
  const buttonText = noPrice ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить';

  modal.render({
    content: cardPreview.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
      description: item.description,
      buttonText: buttonText,
      buttonDisabled: noPrice,
    }),
  });
  modal.open();
});

events.on<IProduct>('card:remove', (item) => {
  basketModel.removeItem(item);
});

events.on('basket:changed', () => {
  header.render({ counter: basketModel.getCount() });
  basket.render(getBasketData());
});

events.on('basket:open', () => {
  modal.render({ content: basket.render() });
  modal.open();
});

events.on('order:open', () => {
  modal.render({ content: orderForm.render() });
  modal.open();
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
  buyerModel.setData({ address: value });
});

events.on<{ value: TPayment }>('order.payment:change', ({ value }) => {
  buyerModel.setData({ payment: value });
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
  buyerModel.setData({ email: value });
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
  buyerModel.setData({ phone: value });
});

events.on('buyer:changed', () => {
  renderOrderForm();
  renderContactsForm();
});

events.on('order:submit', () => {
  modal.render({ content: contactsForm.render() });
});

events.on('contacts:submit', () => {
  const order = {
    ...buyerModel.getData(),
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((item) => item.id),
  };

  apiShop.postOrder(order)
    .then((response) => {
      modal.render({ content: success.render({ total: response.total }) });
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.error('Ошибка при оформлении заказа: ', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

apiShop.getProducts()
     .then((response) => {
      productsModel.setItems(response.items);
     })
     .catch((error) => {
       console.error('Ошибка при получении товаров с сервера: ', error);
     });