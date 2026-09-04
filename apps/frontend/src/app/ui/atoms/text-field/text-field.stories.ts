import type { Meta, StoryObj } from '@storybook/angular-vite';
import { TextField } from './text-field';

const meta: Meta<TextField> = {
  title: 'Atoms/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Name',
    value: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<TextField>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
