import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ActivityLabel } from './activity-label';
import { ACTIVITY_ICON_NAMES } from '../../atoms/icon/icon';

const meta: Meta<ActivityLabel> = {
  title: 'Molecules/ActivityLabel',
  component: ActivityLabel,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'select', options: ACTIVITY_ICON_NAMES },
  },
  args: {
    label: 'Running',
    icon: 'run',
  },
};

export default meta;
type Story = StoryObj<ActivityLabel>;

export const Default: Story = {};

export const Shopping: Story = {
  args: { label: 'shopping', icon: 'shopping-cart' },
};
