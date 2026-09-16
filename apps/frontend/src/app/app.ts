import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageMenubar } from './shared/page-menubar/page-menubar';

@Component({
  imports: [RouterOutlet, PageMenubar],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
