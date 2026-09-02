import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Entry } from './entry';

const meta: Meta<Entry> = {
  title: 'Organisms/Entry',
  component: Entry,
  tags: ['autodocs'],
  args: {
    date: new Date(2026, 7, 31),
    moodFace: 'happy',
    moodColor: '#2ba597',
    moodName: 'Good',
    activities: [{ label: 'activity' }],
    note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vestibulum ut sem vel dapibus. Maecenas quis egestas mi, in congue tellus. Curabitur odio nisl, consequat et lacus ut, dapibus tincidunt dui. Nullam id ex imperdiet, suscipit arcu non, eleifend ligula. Donec interdum et lacus quis iaculis. Nunc a aliquet tortor, ut consequat sem. Donec id mauris interdum, aliquam dolor sit amet, aliquam sapien. Vestibulum fringilla enim finibus augue venenatis pharetra. Nam at ligula quis mi cursus dictum ac id ante.",
  },
};

export default meta;
type Story = StoryObj<Entry>;

export const Default: Story = {
  args: {
    activities: [{ label: 'running' }, { label: 'reading' }, { label: 'cooking' }, { label: 'work' }],
  },};

export const NoActivitiesAndNote: Story = {
  args: { activities: [], note:'' },
};

export const SadMood: Story = {
  args: { moodFace: 'very-sad', moodColor: '#e66442', moodName: 'Horrible', note: 'A rough day.' },
};
