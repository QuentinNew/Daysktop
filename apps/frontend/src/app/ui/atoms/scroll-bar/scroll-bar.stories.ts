import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ScrollBar } from './scroll-bar';

const meta: Meta<ScrollBar> = {
  title: 'Atoms/ScrollBar',
  component: ScrollBar,
  tags: ['autodocs'],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
  args: {
    progress: 0,
    height: 300,
  },
};

export default meta;
type Story = StoryObj<ScrollBar>;

export const Top: Story = {};

export const Middle: Story = {
  args: { progress: 0.5 },
};

export const Bottom: Story = {
  args: { progress: 1 },
};
