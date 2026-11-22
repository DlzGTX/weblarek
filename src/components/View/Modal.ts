import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";


interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected _pageWrapper: HTMLElement;
  protected windowElement: HTMLElement;

  constructor( protected events: IEvents, container: HTMLElement){ 
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    this.windowElement = ensureElement<HTMLElement>('.modal__container', this.container);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.windowElement.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) { 
    this.contentElement.replaceChildren(value);
  }

  open(): void { 
    this.container.classList.add('modal_active');
    this._pageWrapper.classList.add('page__wrapper_locked');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this._pageWrapper.classList.remove('page__wrapper_locked');
    this.contentElement.replaceChildren();
  }
}