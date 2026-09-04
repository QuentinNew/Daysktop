import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ActivityLabel } from './activity-label';
import { Icon } from '../../atoms/icon/icon';

const meta: Meta<ActivityLabel> = {
  title: 'Molecules/ActivityLabel',
  component: ActivityLabel,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Running',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Icon] },
    template: `<app-activity-label [label]="label"><app-icon icon name="arrow-right" /></app-activity-label>`,
  }),
};

export default meta;
type Story = StoryObj<ActivityLabel>;

export const Default: Story = {};
