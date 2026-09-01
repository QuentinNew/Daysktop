import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Tile } from './tile';

const meta: Meta<Tile> = {
  title: 'Layout/Tile',
  component: Tile,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    width: { control: 'number' },
    height: { control: 'number' },
  },
  args: {
    color: '#2d2c3e',
    width: 64,
    height: 64,
  },
};

export default meta;
type Story = StoryObj<Tile>;

export const Empty: Story = {};

export const WithContent: Story = {
  render: (args) => ({
    props: args,
    template: `<app-tile [color]="color" [width]="width*2" [height]="height" style="color: white; font-weight: 600;">A</app-tile>`,
  }),
};
