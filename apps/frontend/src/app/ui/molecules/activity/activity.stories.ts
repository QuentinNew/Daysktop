import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Activity } from './activity';
import { Icon } from '../../atoms/icon/icon';

const meta: Meta<Activity> = {
  title: 'Molecules/Activity',
  component: Activity,
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
    template: `<app-activity [label]="label"><app-icon icon name="arrow-right" /></app-activity>`,
  }),
};

export default meta;
type Story = StoryObj<Activity>;

export const Default: Story = {};
