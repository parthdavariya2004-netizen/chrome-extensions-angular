import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JiraService {
  async createJiraTicket(data: { title: string; description: string }) {
    const auth = btoa(`${environment.JIRA_USERNAME}:${environment.JIRA_API_TOKEN}`);

    const body = {
      fields: {
        project: { key: 'SCRUM' },
        summary: data.title,
        issuetype: { name: 'Task' },
        customfield_10020: 2,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: data.description }],
            },
          ],
        },
      },
    };

    const res = await fetch(`${environment.JIRA_BASE_URL}/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return res.json();
  }
}
