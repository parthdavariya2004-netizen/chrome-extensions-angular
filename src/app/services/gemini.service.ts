import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private genAI = new GoogleGenerativeAI(environment.GOOGLE_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async generateDescription(title: string): Promise<string> {
    const prompt = `Create a ticket description for the following title: ${title}`;

    const result = await this.model.generateContent(prompt);
    return result?.response?.text() || '';
  }
}
