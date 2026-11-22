import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card, ICard, ICardAction } from "./Card";

interface ICardPreview extends ICard {
  category: string;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreview> { 
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor( container: HTMLElement, actions?: ICardAction){
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string){
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach((className) => this.categoryElement.classList.remove(className));
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap])
  }

  set image(value: string){ 
    this.setImage(this.imageElement, CDN_URL + value);
  }

  set description(value: string){
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string){
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean){
    this.buttonElement.disabled = value;
  }
}