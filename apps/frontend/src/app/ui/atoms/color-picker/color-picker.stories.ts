import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ColorPicker } from './color-picker';

const meta: Meta<ColorPicker> = {
  title: 'Atoms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: {
    label: 'Color',
    value: '#2ba597',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ColorPicker>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
