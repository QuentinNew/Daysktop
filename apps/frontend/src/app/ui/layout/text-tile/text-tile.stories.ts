import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TextTile } from './text-tile';

const meta: Meta<TextTile> = {
  title: 'Layout/TextTile',
  component: TextTile,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    width: { control: 'number' },
  },
  args: {
    color: '#2ba597',
    width: 240,
  },
  render: (args) => ({
    props: args,
    template: `<app-text-tile [color]="color" [width]="width">Today was a good day. I went for a long walk and finally finished the book I've been reading for weeks.</app-text-tile>`,
  }),
};

export default meta;
type Story = StoryObj<TextTile>;

export const Default: Story = {};

export const Narrow: Story = {
  args: { width: 140 },
};

export const Wide: Story = {
  args: { width: 400 },
};
