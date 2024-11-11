/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  getHello(): string {
    return 'Hello World!';
  }

  updateLocation(data: any) {
    this.logger.log(data);
  }
}
