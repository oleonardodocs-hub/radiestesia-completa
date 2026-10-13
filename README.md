# Radiestesia Completa — 121 Grafici Radiestesici · v2.0

Aplicativo estático em italiano para GitHub Pages, **sem login**, com biblioteca de 121 esquemas didáticos originais (não cópias de gráficos históricos). O conteúdo radiestésico é simbólico e **não comprova efeitos físicos, diagnósticos ou previsões**.

## Novidades desta versão

- 121 desenhos SVG gerados em composições individuais a partir de 10 famílias temáticas, com etiquetas específicas. Download PNG em alta resolução ou impressão/PDF.
- 121 fichas específicas (`protocols.js`) com caso de uso individual, preparação, materiais, quatro etapas práticas, leitura, verificação e cuidados.
- Percurso guiado de 12 etapas com exercícios e registro de conclusão; 7 leituras da edição inicial preservadas.
- Backup de **favoritos + gráficos estudados + diário + percurso**, com exportação/importação JSON sem serviço externo.
- Pesquisa, categorias, favoritos e diário (CSV / JSON) preservados.
- Cache PWA atualizado v4, priorizando rede para receber versões novas e mantendo fallback offline.
- Interface responsiva; conteúdo inteiramente em italiano.

## Atualizar o GitHub Pages sem perder o link

1. Abra https://github.com/oleonardodocs-hub/radiestesia-completa
2. Na aba **Code**, clique em **Add file → Upload files**.
3. Arraste **todos os arquivos desta pasta extraída**, inclusive `protocols.js` e a pasta `assets` (não o ZIP nem a pasta externa).
4. Confirme que `index.html`, `app.js`, `data.js`, `protocols.js`, `style.css`, `sw.js`, `manifest.webmanifest` ficam na raiz.
5. Confirme a substituição dos arquivos de mesmo nome e clique em **Commit changes**.
6. Aguarde a atualização do GitHub Pages e recarregue com `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) se necessário.

Seu endereço público continua: https://oleonardodocs-hub.github.io/radiestesia-completa/

**Não exclua o repositório ou altere o nome dele:** isso poderia mudar o link. O app continua público; o link na área de membros não garante controle de acesso.

## Estrutura de arquivos

- `index.html`: marcação e navegação.
- `style.css`: visual e responsividade.
- `app.js`: interface, desenhos SVG, exportação de PNG, curso, diário e backup.
- `data.js`: nomes, categorias, perguntas e exercícios individuais.
- `protocols.js`: 121 protocolos estendidos e 12 módulos de aprendizagem.
- `sw.js`: cache offline.
- `manifest.webmanifest`: informações do app instalável.
- `assets/`: logos e ícones.

## Privacidade e continuidade de dados

A versão mantém a **mesma chave de armazenamento local** (`rc121-v2:`), preservando normalmente favoritos e diário já registrados no mesmo dispositivo/navegador. O curso e backups são funcionalidades novas. O backup JSON **não criptografa** os dados; guarde-o com segurança.

Não há backend, login, pagamento integrado, sincronização de dados entre aparelhos ou mecanismo de proteção contra compartilhamento do link. Importar backup permite unificar dados entre dispositivos, manualmente.

## Limites editoriais

Os 121 esquemas são ilustrações e rotinas **originais, organizadas por temas**, não uma coleção de 121 radiônicos clássicos historicamente documentados. A oferta comercial deve deixar explícita essa distinção. A radiestesia não tem validação científica para diagnóstico ou tratamento e não substitui profissionais qualificados, normas de segurança, avaliação de alimentos, medicina ou decisões financeiras.
