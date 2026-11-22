import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IForm { 
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T & IForm>{
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container:HTMLFormElement){
    super(container)
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${container.name}.${field}:change`, { field, value });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value:boolean){
      this.submitButton.disabled = !value;
  }

  set errors(value: string){ 
    this.errorsElement.textContent = value;
  }
  
}