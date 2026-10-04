import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { Authorize } from './decorators/authorize.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login e gerar token JWT',
    description: 'Autentica o usuário com e-mail e senha e retorna o token de acesso Bearer JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso. Retorna o token JWT e dados do usuário.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas ou usuário inativo.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário e gerar token JWT',
    description: 'Cria uma nova conta de usuário com senha criptografada e retorna o token JWT.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário cadastrado com sucesso. Retorna o token JWT.',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já cadastrado.',
  })
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @Authorize()
  @Get('me')
  @ApiOperation({
    summary: 'Consultar dados do usuário autenticado',
    description: 'Retorna as informações do usuário atual extraídas do token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do perfil do usuário autenticado.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token ausente ou inválido.',
  })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
