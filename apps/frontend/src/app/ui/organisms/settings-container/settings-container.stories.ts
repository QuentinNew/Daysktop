import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SettingsContainer } from './settings-container';

const meta: Meta<SettingsContainer> = {
  title: 'Organisms/SettingsContainer',
  component: SettingsContainer,
  tags: ['autodocs'],
  args: {
    title: 'Import / Export',
    width: 420,
  },
};

export default meta;
type Story = StoryObj<SettingsContainer>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-settings-container [title]="title" [width]="width">
        <p>Text</p>
        <p>Text</p>
      </app-settings-container>
    `,
  }),
};

export const ShortTitle: Story = {
  args: { title: 'Account' },
  render: (args) => ({
    props: args,
    template: `
      <app-settings-container [title]="title" [width]="width">
        <p>Text</p>
      </app-settings-container>
    `,
  }),
};
