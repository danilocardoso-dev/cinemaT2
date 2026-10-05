import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  it('converte restrição de chave estrangeira do adapter-pg em conflito', () => {
    const json = jest.fn();
    const status = jest.fn();
    const response = { status, json };
    status.mockReturnValue(response);
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as unknown as ArgumentsHost;
    const exception = {
      code: 'P2039',
      meta: {
        driverAdapterError: {
          cause: { originalCode: '23001' },
        },
      },
    } as unknown as Prisma.PrismaClientKnownRequestError;

    new PrismaExceptionFilter().catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: HttpStatus.CONFLICT }),
    );
  });
});
