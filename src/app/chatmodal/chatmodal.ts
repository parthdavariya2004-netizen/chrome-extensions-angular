import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import { environment } from '../../environments/environment.development';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-chatmodal',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatmodal.html',
  styleUrl: './chatmodal.css',
})
export class Chatmodal implements AfterViewInit {
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages = signal<any[]>([]);
  loading = signal(false);
  input = '';

  HISTORY_KEY = 'extchat-history';

  constructor(private sanitizer: DomSanitizer) {
    const history = this.loadHistory();
    this.messages.set(history);

    effect(() => {
      this.messages();
      this.loading();
      this.scrollToBottom();
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  close() {
    this.closeModal.emit();
  }

  loadHistory() {
    const saved = localStorage.getItem(this.HISTORY_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  saveHistory(list: any[]) {
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(list));
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'auto' });
    }, 50);
  }

  convertMarkdown(text: string) {
    const escaped = text.replace(/</g, '').replace(/>/g, '');

    let html: any = marked(escaped, {
      gfm: true,
      breaks: true,
      pedantic: false,
    });

    html = this.sanitizer.bypassSecurityTrustHtml(html);

    return html;
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    if (!this.input.trim()) return;

    const userText = this.input;

    const newUserMsg = {
      role: 'user',
      parts: [{ text: userText }],
    };

    const updated = [...this.messages(), newUserMsg];
    this.messages.set(updated);
    this.saveHistory(updated);

    this.input = '';
    this.loading.set(true);

    try {
      const genAI = new GoogleGenerativeAI(environment.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const chat = model.startChat({
        history: this.messages().map((m) => ({
          role: m.role,
          parts: m.parts,
        })),
      });

      const result = await chat.sendMessage(userText);
      const reply = result.response.text();

      const newModelMsg = {
        role: 'model',
        parts: [{ text: reply }],
        html: reply,
      };

      const finalList = [...this.messages(), newModelMsg];
      this.messages.set(finalList);
      this.saveHistory(finalList);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(event);
    }
  }
}
