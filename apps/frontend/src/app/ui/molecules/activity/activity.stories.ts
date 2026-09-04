import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Activity } from './activity';
import { ACTIVITY_ICON_NAMES } from '../../atoms/icon/icon';

const meta: Meta<Activity> = {
  title: 'Molecules/Activity',
  component: Activity,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ACTIVITY_ICON_NAMES,
    },
    selected: { control: 'boolean' },
  },
  args: {
    icon: 'run',
    label: 'Color',
    selected: false,
  },
};

export default meta;
type Story = StoryObj<Activity>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};
