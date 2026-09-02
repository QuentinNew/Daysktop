import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MenuButton } from './menu-button';
import { Icon } from '../icon/icon';

const meta: Meta<MenuButton> = {
  title: 'Atoms/MenuButton',
  component: MenuButton,
  tags: ['autodocs'],
  args: {
    label: 'Entries',
    selected: false,
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Icon] },
    template:
      '<app-menu-button [label]="label" [selected]="selected"><app-icon icon name="list" /></app-menu-button>',
  }),
};

export default meta;
type Story = StoryObj<MenuButton>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};
