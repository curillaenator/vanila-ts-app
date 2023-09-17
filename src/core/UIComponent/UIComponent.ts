import type { DOMElement } from './interfaces';

export interface UIComponentsProps extends Partial<HTMLElement> {
  as?: DOMElement;
}

export class UIComponent {
  public component: HTMLElement;

  constructor(props: UIComponentsProps) {
    const { as = 'div', dataset, ...rest } = props;

    this.component = document.createElement(as);

    Object.entries(rest).forEach(([attribute, attrValue]) => {
      // @ts-ignore
      this.component[attribute] = attrValue;
    });

    if (dataset) {
      Object.entries(dataset).forEach(([dataAttribute, dataAttrValue]) => {
        this.component.dataset[dataAttribute] = dataAttrValue;
      });
    }
  }

  render() {
    return this.component;
  }
}
