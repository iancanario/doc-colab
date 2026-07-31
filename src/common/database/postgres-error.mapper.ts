import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

export function mapPostgresError(code: string): HttpException {
  switch (code) {
    case '23505':
      return new ConflictException('Duplicate record');

    case '23503':
      return new BadRequestException('Invalid relationship');

    case '22P02':
      return new BadRequestException('Invalid UUID');

    default:
      return new InternalServerErrorException();
  }
}
