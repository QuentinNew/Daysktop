import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SpeechBubble } from './speech-bubble';

const meta: Meta<SpeechBubble> = {
  title: 'Atoms/SpeechBubble',
  component: SpeechBubble,
  tags: ['autodocs'],
  argTypes: {
    tailPosition: { control: 'select', options: ['left', 'right'] },
    color: { control: 'select', options: ['dark', 'light'] },
  },
  args: {
    tailPosition: 'left',
    color: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<app-speech-bubble [tailPosition]="tailPosition" [color]="color">What was my highlight of the month?</app-speech-bubble>`,
  }),
};

export default meta;
type Story = StoryObj<SpeechBubble>;

export const Default: Story = {};
