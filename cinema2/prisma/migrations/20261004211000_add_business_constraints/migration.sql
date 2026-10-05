-- Impede duas sessões na mesma sala e horário.
CREATE UNIQUE INDEX "sessoes_sala_id_data_hora_key"
ON "sessoes"("sala_id", "data_hora");

-- Impede a venda do mesmo assento mais de uma vez na mesma sessão.
-- O PostgreSQL permite múltiplos NULLs, mantendo o assento opcional.
CREATE UNIQUE INDEX "ingressos_sessao_id_assento_key"
ON "ingressos"("sessao_id", "assento");
