import { Card, ICard, ICardAction } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICardCatalog extends ICard { 
  category: string;
  image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardAction){
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    
  
    // Клик по телу карточки → подробности о товаре.
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach((className) => this.categoryElement.classList.remove(className));
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap])
   }

  set image(value: string){
    this.setImage(this.imageElement, CDN_URL + value);
  }
}