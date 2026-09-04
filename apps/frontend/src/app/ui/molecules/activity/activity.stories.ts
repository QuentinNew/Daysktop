import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Activity } from './activity';

const meta: Meta<Activity> = {
  title: 'Molecules/Activity',
  component: Activity,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['arrow-right', 'arrow-left', 'calendar-week', 'chart-dots', 'list', 'run', 'search', 'settings'],
    },
    selected: { control: 'boolean' },
  },
  args: {
    icon: 'arrow-right',
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
