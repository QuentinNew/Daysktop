import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MonthPicker } from './month-picker';

const meta: Meta<MonthPicker> = {
  title: 'Molecules/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  args: {
    date: new Date(2026, 7, 1),
    earliest: new Date(2026, 0, 1),
    latest: new Date(2026, 11, 1),
  },
  render: (args) => ({
    props: {
      ...args,
      dateChange: function (this: { date: Date }, date: Date) {
        this.date = date;
      },
    },
    template:
      '<app-month-picker [date]="date" [earliest]="earliest" [latest]="latest" (dateChange)="dateChange($event)" />',
  }),
};

export default meta;
type Story = StoryObj<MonthPicker>;

export const Default: Story = {};

export const LongMonthName: Story = {
  args: { date: new Date(2026, 8, 1) },
};

export const NearBounds: Story = {
  args: { date: new Date(2026, 11, 1) },
};
