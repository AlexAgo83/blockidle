import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKeys: string[];

  constructor() {
    this.apiKeys = (process.env.API_KEYS || process.env.API_KEY || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.apiKeys.length) {
      throw new UnauthorizedException('API key not configured');
    }
    const request = context.switchToHttp().getRequest();
    const key = (request.headers['x-api-key'] || request.headers['X-API-Key'] || '').toString().trim();
    if (!key) {
      throw new UnauthorizedException('API key required');
    }
    if (!this.apiKeys.includes(key)) {
      throw new ForbiddenException('Invalid API key');
    }
    return true;
  }
}
