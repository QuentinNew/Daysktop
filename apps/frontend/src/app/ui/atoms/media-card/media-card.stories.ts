import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MediaCard } from './media-card';

const meta: Meta<MediaCard> = {
  title: 'Atoms/MediaCard',
  component: MediaCard,
  tags: ['autodocs'],
  args: {
    image: 'https://picsum.photos/seed/Daylio/320/320',
    name: 'Media name',
    size: 160,
  },
};

export default meta;
type Story = StoryObj<MediaCard>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};

export const NoText: Story = {
  args: {
    noText: true,
  },
};

export const LongName: Story = {
  args: {
    name: 'A very long media name that should wrap onto a second line',
  },
};

export const WithDelete: Story = {
  args: {
    deletable: true,
  },
};
