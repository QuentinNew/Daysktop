import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Calendar, CalendarEntry } from './calendar';

const sampleEntries: CalendarEntry[] = [
  { date: new Date(2026, 7, 1), moodFace: 'happy', moodColor: '#59d068' },
  { date: new Date(2026, 7, 2), moodFace: 'very-happy', moodColor: '#2ba597' },
  { date: new Date(2026, 7, 3), moodFace: 'very-happy', moodColor: '#2ba597' },
  { date: new Date(2026, 7, 4), moodFace: 'neutral', moodColor: '#61bec7' },
  { date: new Date(2026, 7, 10), moodFace: 'sad', moodColor: '#ffad62' },
  { date: new Date(2026, 7, 15), moodFace: 'very-sad', moodColor: '#e66442' },
  { date: new Date(2026, 7, 22), moodFace: 'happy', moodColor: '#59d068' },
];

const meta: Meta<Calendar> = {
  title: 'Organisms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    date: new Date(2026, 7, 1),
    earliest: new Date(2026, 0, 1),
    latest: new Date(2026, 11, 1),
    entries: sampleEntries,
  },
  render: (args) => ({
    props: {
      ...args,
      dateChange: function (this: { date: Date }, date: Date) {
        this.date = date;
      },
    },
    template:
      '<app-calendar [date]="date" [earliest]="earliest" [latest]="latest" [entries]="entries" (dateChange)="dateChange($event)" />',
  }),
};

export default meta;
type Story = StoryObj<Calendar>;

export const Default: Story = {};
