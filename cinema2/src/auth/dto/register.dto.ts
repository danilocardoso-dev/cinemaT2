import { PickType } from '@nestjs/swagger';
import { CreateUsuarioDto } from '../../usuarios/dto/create-usuario.dto';

export class RegisterDto extends PickType(CreateUsuarioDto, [
  'nome',
  'email',
  'senha',
] as const) {}
