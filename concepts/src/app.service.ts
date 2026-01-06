import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    const appName = this.configService.get<string>('appName');
    console.log('appName', appName);
    return `Hello editting  ${appName}`;
  }
}
