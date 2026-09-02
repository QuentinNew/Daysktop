import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Menubar } from './menubar';

const meta: Meta<Menubar> = {
  title: 'Molecules/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  args: {
    selected: 'entries',
    width: 480,
  },
};

export default meta;
type Story = StoryObj<Menubar>;

export const Default: Story = {};

export const StatisticsSelected: Story = {
  args: { selected: 'statistics' },
};
