import { Component, input } from '@angular/core';

export type SpeechBubbleTailPosition = 'left' | 'right';
export type SpeechBubbleColor = 'dark' | 'light';

@Component({
  selector: 'app-speech-bubble',
  templateUrl: './speech-bubble.html',
  styleUrl: './speech-bubble.scss',
  host: {
    '[class.speech-bubble--tail-right]': "tailPosition() === 'right'",
    '[class.speech-bubble--light]': "color() === 'light'",
  },
})
export class SpeechBubble {
  readonly tailPosition = input<SpeechBubbleTailPosition>('left');
  readonly color = input<SpeechBubbleColor>('dark');
}
