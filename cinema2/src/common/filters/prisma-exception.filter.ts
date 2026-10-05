import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const adapterCause = (
      exception.meta as
        | {
            driverAdapterError?: {
              cause?: { originalCode?: string; code?: string };
            };
          }
        | undefined
    )?.driverAdapterError?.cause;

    if (exception.code === 'P2025') {
      const error = new NotFoundException('Registro não encontrado.');
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }

    if (exception.code === 'P2002') {
      const error = new ConflictException(
        'Já existe um registro com esses dados.',
      );
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }

    if (
      exception.code === 'P2003' ||
      exception.code === 'P2014' ||
      (exception.code === 'P2039' &&
        ['23001', '23503'].includes(
          adapterCause?.originalCode ?? adapterCause?.code ?? '',
        ))
    ) {
      const error = new ConflictException(
        'A operação viola um relacionamento existente.',
      );
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }

    if (exception.code === 'P2034') {
      const error = new ConflictException(
        'A operação sofreu um conflito concorrente. Tente novamente.',
      );
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }

    const error = new InternalServerErrorException();
    response.status(error.getStatus()).json(error.getResponse());
  }
}
