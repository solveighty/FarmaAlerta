import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  debug(message: string) {
    super.debug(message);
  }

  log(message: string) {
    super.log(message);
  }

  error(message: string, trace?: string) {
    super.error(message, trace);
  }

  warn(message: string) {
    super.warn(message);
  }

  verbose(message: string) {
    super.verbose(message);
  }
}
