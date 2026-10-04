import type { JwtSignOptions } from '@nestjs/jwt';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET não definida. Configure a variável no .env.');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET deve possuir pelo menos 32 caracteres.');
  }

  return secret;
}

export function getJwtExpiresIn(): JwtSignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN?.trim() ||
    '1d') as JwtSignOptions['expiresIn'];
}
