import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TileWithTitle } from './tile-with-title';

const meta: Meta<TileWithTitle> = {
  title: 'Layout/TileWithTitle',
  component: TileWithTitle,
  tags: ['autodocs'],
  args: {
    title: 'Import / Export',
    width: 420,
  },
};

export default meta;
type Story = StoryObj<TileWithTitle>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-tile-with-title [title]="title" [width]="width">
        <p>Text</p>
        <p>Text</p>
      </app-tile-with-title>
    `,
  }),
};

export const ShortTitle: Story = {
  args: { title: 'Account' },
  render: (args) => ({
    props: args,
    template: `
      <app-tile-with-title [title]="title" [width]="width">
        <p>Text</p>
      </app-tile-with-title>
    `,
  }),
};
