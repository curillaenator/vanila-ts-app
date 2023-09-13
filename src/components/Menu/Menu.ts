import { Button } from '@src/components/Button';

import styles from './menu.module.scss';

interface MenuProps extends Partial<HTMLDivElement> {
  toggleAside?: () => void;
}

export class Menu {
  private container: HTMLElement = document.createElement('div');

  constructor(props: MenuProps) {
    const { toggleAside, ...rest } = props;

    Object.entries(rest).forEach(([propName, propValue]) => {
      // @ts-ignore
      this.container[propName] = propValue;
    });

    this.container.id = 'tasks-aside-menu';
    this.container.classList.add(styles.menu);

    const header = document.createElement('div');
    header.classList.add(styles.header);

    const logo = document.createElement('h1');
    logo.classList.add(styles.logo);
    logo.innerText = 'Tasks';

    header.append(
      // logo,

      new Button({
        text: '•••',
        onclick: toggleAside,
      }).render(),
    );

    this.container.append(header);
  }

  render() {
    return this.container;
  }
}
