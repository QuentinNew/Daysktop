import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ActivityPicker, ActivityPickerGroup } from './activity-picker';

const groups: ActivityPickerGroup[] = [
  {
    name: 'Emotion',
    activities: [
      { id: 1, name: 'Color', icon: 'run' },
      { id: 2, name: 'Color', icon: 'run' },
      { id: 3, name: 'Color', icon: 'run' },
    ],
  },
  {
    name: 'Social',
    activities: [
      { id: 4, name: 'Color', icon: 'run' },
      { id: 5, name: 'Color', icon: 'run' },
    ],
  },
];

const meta: Meta<ActivityPicker> = {
  title: 'Organisms/ActivityPicker',
  component: ActivityPicker,
  tags: ['autodocs'],
  args: {
    groups,
    selected: [],
    multiple: false,
  },
};

export default meta;
type Story = StoryObj<ActivityPicker>;

export const SingleSelect: Story = {
  args: { multiple: false, selected: [2] },
};

export const MultiSelect: Story = {
  args: { multiple: true, selected: [1, 4] },
};
