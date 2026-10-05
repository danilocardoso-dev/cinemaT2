import { PartialType } from '@nestjs/swagger';
import { CreateLancheDto } from './create-lanche.dto';

export class UpdateLancheDto extends PartialType(CreateLancheDto) {}
