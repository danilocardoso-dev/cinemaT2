-- Preserve order totals and ticket history by preventing cascade deletion
-- from catalog entities into sessions and tickets.
ALTER TABLE "sessoes" DROP CONSTRAINT "sessoes_filme_id_fkey";
ALTER TABLE "sessoes" DROP CONSTRAINT "sessoes_sala_id_fkey";
ALTER TABLE "ingressos" DROP CONSTRAINT "ingressos_sessao_id_fkey";

ALTER TABLE "sessoes"
  ADD CONSTRAINT "sessoes_filme_id_fkey"
  FOREIGN KEY ("filme_id") REFERENCES "filmes"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sessoes"
  ADD CONSTRAINT "sessoes_sala_id_fkey"
  FOREIGN KEY ("sala_id") REFERENCES "salas"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ingressos"
  ADD CONSTRAINT "ingressos_sessao_id_fkey"
  FOREIGN KEY ("sessao_id") REFERENCES "sessoes"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
