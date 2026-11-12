import { z } from 'zod';

// Mesmas regras de src/schemas/validation.ts do painel web
export const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  sinopse: z.string().min(10, 'Sinopse deve ter no mínimo 10 caracteres'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.number().positive('Duração deve ser maior que 0'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  datasExibicao: z.string().min(1, 'Datas de exibição são obrigatórias'),
});

export const salaSchema = z.object({
  numero: z.number().positive('Número da sala deve ser maior que 0'),
  capacidade: z.number().positive('Capacidade deve ser maior que 0'),
});

export const sessaoSchema = z.object({
  filmeId: z.number().positive('Selecione um filme'),
  salaId: z.number().positive('Selecione uma sala'),
  dataHora: z.string().refine((v) => {
    const d = new Date(v);
    return !Number.isNaN(d.getTime()) && d > new Date();
  }, 'Informe uma data futura válida (AAAA-MM-DD HH:mm)'),
});

export const lancheSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  valorUnitario: z.number().positive('Valor deve ser positivo'),
  qtUnidade: z.number().int().nonnegative('Quantidade deve ser 0 ou maior'),
});

export const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve possuir no mínimo 6 caracteres'),
});

export const registroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve possuir no mínimo 6 caracteres'),
});

// Converte erros do zod em { campo: mensagem }
export function errosDoZod(resultado) {
  const erros = {};
  for (const issue of resultado.error.issues) {
    const campo = issue.path[0];
    if (campo && !erros[campo]) erros[campo] = issue.message;
  }
  return erros;
}
