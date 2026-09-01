import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Mood } from './mood';

const meta: Meta<Mood> = {
  title: 'Atoms/Mood',
  component: Mood,
  tags: ['autodocs'],
  argTypes: {
    face: {
      control: 'select',
      options: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
    },
    color: { control: 'color' },
    size: { control: 'number' },
  },
  args: {
    face: 'happy',
  },
};

export default meta;
type Story = StoryObj<Mood>;

export const VeryHappy: Story = {
  args: { face: 'very-happy' },
};

export const Happy: Story = {
  args: { face: 'happy', color: '#59d068' },
};

export const Neutral: Story = {
  args: { face: 'neutral', color: '#61bec7' },
};

export const Sad: Story = {
  args: { face: 'sad', color: '#ffad62' },
};

export const VerySad: Story = {
  args: { face: 'very-sad', color: '#e66442' },
};
