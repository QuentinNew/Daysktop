import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Notification } from './notification';

const meta: Meta<Notification> = {
  title: 'Organisms/Notification',
  component: Notification,
  tags: ['autodocs'],
  args: {
    variant: 'success',
    title: 'Title',
    subtext: 'Subtext',
    width: 420,
  },
};

export default meta;
type Story = StoryObj<Notification>;

export const Success: Story = {};

export const Error: Story = {
  args: { variant: 'error' },
};

export const NoSubtext: Story = {
  args: { subtext: '' },
};
