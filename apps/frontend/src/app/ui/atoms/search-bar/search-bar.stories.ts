import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SearchBar } from './search-bar';

const meta: Meta<SearchBar> = {
  title: 'Atoms/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    value: '',
    placeholder: 'Search',
  },
};

export default meta;
type Story = StoryObj<SearchBar>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: 'running' },
};
