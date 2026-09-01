import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Icon } from './icon';

const meta: Meta<Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: ['arrow-right', 'arrow-left'] },
    size: { control: 'number' },
  },
  args: {
    name: 'arrow-right',
    size: 20,
  },
};

export default meta;
type Story = StoryObj<Icon>;

export const ArrowRight: Story = {
  args: { name: 'arrow-right' },
};

export const ArrowLeft: Story = {
  args: { name: 'arrow-left' },
};
