import type { Meta, StoryObj } from '@storybook/angular-vite';
import { MoodButton } from './mood-button';

const meta: Meta<MoodButton> = {
  title: 'Molecules/MoodButton',
  component: MoodButton,
  tags: ['autodocs'],
  argTypes: {
    face: {
      control: 'select',
      options: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
    },
    color: { control: 'color' },
    selected: { control: 'boolean' },
  },
  args: {
    face: 'happy',
    color: '#59d068',
    selected: false,
  },
};

export default meta;
type Story = StoryObj<MoodButton>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};
