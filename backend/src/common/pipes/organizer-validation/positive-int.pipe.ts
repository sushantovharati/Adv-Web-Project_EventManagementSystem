import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: any) {
    const n = Number(value);

    if (!Number.isInteger(n) || n <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }

    return n;
  }
}
