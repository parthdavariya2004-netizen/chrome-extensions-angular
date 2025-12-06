import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AIService } from '../services/gemini.service';
import { JiraService } from '../services/jira.service';

@Component({
  selector: 'app-ticketmodal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ticketmodal.html',
  styleUrl: './ticketmodal.css',
})
export class Ticketmodal {
  @Output() closeModal = new EventEmitter<void>();
  @Input() selectionText: string = '';

  ngOnChanges() {
    console.log(this.selectionText);
  }

  loadingGenerate = signal(false);
  loadingSubmit = signal(false);

  constructor(private aiService: AIService, private jiraService: JiraService) {}

  onSubmit(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((c: any) => c.markAsTouched());
      return;
    }
    this.createTicket(form.value);
  }

  async createTicket(formValue: { title: string; description: string }) {
    this.loadingSubmit.set(true);
    try {
      await this.jiraService.createJiraTicket(formValue);

      alert('Ticket created successfully!');
      this.closeModal.emit();
    } catch (err) {
      console.error(err);
      alert('Failed to create ticket.');
    } finally {
      this.loadingSubmit.set(false);
    }
  }

  async onGenerateDescription(titleModel: NgModel, descModel: NgModel) {
    if (!titleModel.value || titleModel.invalid) {
      titleModel.control.markAsTouched();
      return;
    }

    this.loadingGenerate.set(true);

    try {
      const aiText = await this.aiService.generateDescription(titleModel.value);

      descModel.control.setValue(aiText);
      descModel.control.markAsTouched();
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      this.loadingGenerate.set(false);
    }
  }

  close() {
    this.closeModal.emit();
  }
}
