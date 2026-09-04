import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Icon, IconName } from './icon';

const ICON_NAMES: IconName[] = [
  'arrow-right',
  'arrow-left',
  'calendar-week',
  'chart-dots',
  'list',
  'run',
  'search',
  'settings',
  'circle-check',
  'circle-x'
];

const meta: Meta<Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'number' },
  },
  args: {
    name: 'arrow-right',
    size: 20,
  },
};

export default meta;
type Story = StoryObj<Icon>;

export const SimpleIcon: Story = {
  args: { name: 'calendar-week' },
};

export const AllIcons: Story = {
  render: () => ({
    props: { names: ICON_NAMES },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 24px;">
        @for (name of names; track name) {
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 72px;">
            <app-icon [name]="name" [size]="28" />
            <span style="font-size: 12px; text-align: center;">{{ name }}</span>
          </div>
        }
      </div>
    `,
  }),
};
