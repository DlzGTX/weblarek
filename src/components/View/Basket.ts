import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasket { 
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket>{ 
  protected listElement: HTMLElement;
  protected buttonElement: HTMLButtonElement; 
  protected priceElement: HTMLElement;

  constructor(protected events: IEvents, container:HTMLElement){ 
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    this.buttonElement.addEventListener('click', () => { 
      this.events.emit('order:open')
     })
  }

  set items(value: HTMLElement[]){
    if (value.length === 0){
      this.listElement.textContent = 'Корзина пуста';
      this.buttonElement.disabled = true;
    } else {
      this.listElement.replaceChildren(...value);
      this.buttonElement.disabled = false;
    }
  }

  set total(value: number){
    this.priceElement.textContent = `${value} синапсов`;
  }
}