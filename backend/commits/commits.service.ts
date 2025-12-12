import { Injectable } from '@nestjs/common';

@Injectable()
export class CommitsService {
  private readonly owner = process.env.GITHUB_OWNER || 'AlexAgo83';
  private readonly repo = process.env.GITHUB_REPO || 'blockidle';

  async list(limit = 10) {
    const perPage = Math.max(1, Math.min(100, limit));
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/commits?per_page=${perPage}`;
    const headers: Record<string, string> = {
      'User-Agent': 'blockidle-backend'
    };
    const token = process.env.GITHUB_TOKEN?.trim();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data)
      ? data.map((c: any) => ({
          hash: c.sha ? c.sha.slice(0, 7) : '',
          message: c.commit?.message?.split('\n')[0] || '',
          date: c.commit?.author?.date?.slice(0, 10) || ''
        }))
      : [];
  }
}
