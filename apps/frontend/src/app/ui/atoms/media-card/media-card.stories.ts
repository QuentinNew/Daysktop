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
