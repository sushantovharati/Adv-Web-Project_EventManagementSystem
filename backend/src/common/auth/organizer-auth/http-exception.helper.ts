import {
    BadRequestException,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';

export const HttpErr = {
    badRequest: (msg = 'Bad request') => new BadRequestException(msg),
    unauthorized: (msg = 'Unauthorized') => new UnauthorizedException(msg),
    conflict: (msg = 'Already exists') => new ConflictException(msg),
    notFound: (msg = 'Not found') => new NotFoundException(msg),
    forbidden: (msg = 'Forbidden') => new ForbiddenException(msg),
};
