import './scss/styles.scss';
import { ProductModel } from './components/Model/ProductModel';
import { BasketModel } from './components/Model/BasketModel';
import { BuyerModel } from './components/Model/BuyerModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiShop } from './components/Api/ApiShop';
import { API_URL } from './utils/constants';
// test1
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));


header.render({ counter: 3 });
events.on('basket:open', () => console.log('Клик по корзине'));

const testContent = document.createElement('div');
testContent.textContent = '5';
modal.render({ content: testContent });
modal.open();
// test 1 

//test 2 
import { cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/View/CardCatalog';
//test 2

//test 3 
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
const basketProduct = apiProducts.items[0];

const cardBasket = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
  onClick: () => console.log('Удалить товар: ', basketProduct.id),
});

modal.render({
  content: cardBasket.render({
    title: basketProduct.title,
    price: basketProduct.price,
    index: 1,
  }),
});
modal.open();
//test 3
const productsModel = new ProductModel();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems());
console.log('Товар с нужным id: ', productsModel.getItem(apiProducts.items[2].id));
productsModel.setPreview(apiProducts.items[1]);
console.log('Товар в превью: ', productsModel.getPreview());


const basketModel = new BasketModel();
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Корзина после добавления: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());
console.log('Есть ли первый товар: ', basketModel.hasItem(apiProducts.items[0].id));
basketModel.removeItem(apiProducts.items[0]);
console.log('Корзина после удаления: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());
console.log('Есть ли первый товар: ', basketModel.hasItem(apiProducts.items[0].id));
basketModel.clear();
console.log('Корзина после отчистки: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

const buyerModel = new BuyerModel();
buyerModel.setData({ address: 'ул. Ленина' });
console.log('Только адрес: ', buyerModel.getData());
buyerModel.setData({ email: 'a@b.ru' });
console.log('Адрес и email: ', buyerModel.getData());
console.log('Ошибки, форма не заполнена: ', buyerModel.validate());
buyerModel.setData({ payment: 'cash' });
buyerModel.setData({ phone: '81481284128' });
console.log('Ошибки, форма заполнена: ', buyerModel.validate());
buyerModel.clear();
console.log('После очистки: ', buyerModel.getData());
console.log('Ошибки после очистки: ', buyerModel.validate());

const api = new Api(API_URL);
const apiShop = new ApiShop(api);


apiShop.getProducts()
     .then((response) => {
      productsModel.setItems(response.items);
      console.log('Каталог с сервера: ', productsModel.getItems());
     })
     .catch((error) => {
       console.error('Ошибка при получении товаров с сервера: ', error);
     });