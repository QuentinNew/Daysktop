import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Tabs } from './tabs';

const meta: Meta<Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    labels: ['Medias', 'Search', 'ChatAI'],
    selected: 0,
  },
};

export default meta;
type Story = StoryObj<Tabs>;

export const Default: Story = {};

export const SecondSelected: Story = {
  args: { selected: 1 },
};
