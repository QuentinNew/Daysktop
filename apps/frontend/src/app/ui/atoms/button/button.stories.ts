import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Button } from './button';
import { Icon } from '../icon/icon';

const meta: Meta<Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['filled', 'outlined', 'text'] },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'filled',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [disabled]="disabled">Click me</app-button>`,
  }),
};

export default meta;
type Story = StoryObj<Button>;

export const Filled: Story = {
  args: { variant: 'filled' },
};


export const WithOnlyIcon: Story = {
  args: { variant: 'filled' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Icon] },
    template: `<app-button [variant]="variant" [disabled]="disabled" [iconOnly]="true"><app-icon name="arrow-right" /></app-button>`,
  }),
};

export const WithTrailingIcon: Story = {
  args: { variant: 'filled' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Icon] },
    template: `<app-button [variant]="variant" [disabled]="disabled">Next <app-icon name="arrow-right" /></app-button>`,
  }),
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Text: Story = {
  args: { variant: 'text' },
};

export const Disabled: Story = {
  args: { variant: 'filled', disabled: true },
};



