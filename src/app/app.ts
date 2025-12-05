import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ticketmodal } from './ticketmodal/ticketmodal';
import { Chatmodal } from './chatmodal/chatmodal';

type ModalType = 'ticket' | 'chat' | null;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Ticketmodal, Chatmodal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('jiraangular');
  activeModal = signal<ModalType>(null);

  private eventHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const type = customEvent.detail?.type;
    if (type === 'ticket') {
      this.activeModal.set('ticket');
    } else if (type === 'chat') {
      this.activeModal.set('chat');
    }
  };

  ngOnInit() {
    window.addEventListener('ext-show-modal', this.eventHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('ext-show-modal', this.eventHandler);
  }

  closeModal() {
    this.activeModal.set(null);
  }
}
