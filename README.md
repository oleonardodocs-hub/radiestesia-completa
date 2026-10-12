# Radiestesia Completa — 121 Grafici Radiestesici

Aplicativo **em italiano**, desenvolvido para funcionar sem login e sem banco de dados em uma hospedagem de arquivos estáticos, como **GitHub Pages**.

## Conteúdo da versão

- 121 gráficos originais divididos em 10 categorias, cada um com desenho SVG exclusivo, objetivo, atividade específica e orientação de uso.
- Download de cada gráfico como PNG 1920 × 2130 px e opção de imprimir / salvar em PDF pelo navegador.
- Busca por título, tema e finalidade, filtros por categoria e ordenação.
- Favoritos e gráficos estudados.
- Diário de prática com exportação JSON ou CSV.
- 7 aulas de método radiestésico e uso consciente.
- Layout responsivo, manifest PWA e cache para uso posterior sem conexão (depois de carregar online).

**Nota editorial:** os desenhos são *esquemas simbólicos originais para estudo*. Não são reproduções de 121 gráficos históricos de terceiros, nem instrumentos cientificamente comprovados de diagnóstico ou de tratamento. Revise a copy de vendas para refletir essa distinção.

## Publicação no GitHub Pages

1. Crie um repositório novo no GitHub, por exemplo `radiestesia-completa`.
2. Envie **o conteúdo desta pasta** para a raiz do repositório: `index.html`, `app.js`, `data.js`, `style.css`, `sw.js`, `manifest.webmanifest` e `assets/`.
3. Em **Settings → Pages → Build and deployment**, selecione **Deploy from a branch**; branch `main`, pasta `/(root)`. Salve.
4. Aguarde o GitHub mostrar a URL pública no painel Pages. Ela terá o formato `https://SEU-USUARIO.github.io/radiestesia-completa/`.
5. Insira a URL real na área de membros do produto.

> O GitHub é um local para guardar os arquivos, e o GitHub Pages é o serviço que exibe o app. O link publicado é **público**: colocar o endereço apenas na área de membros não restringe compartilhamento por terceiros.

## Testar localmente

Abra um terminal na pasta e execute `python3 -m http.server 8080` para acessar `http://localhost:8080`. O acesso por `file://` pode afetar recursos como o cache offline.

## Onde editar o conteúdo

- `data.js` → nomes, objetivos, atividades, termos de cada gráfico e lições.
- `style.css` → cores e aparência.
- `assets/` → logotipo e ícones.
- `app.js` → interface, criação de gráficos SVG e lógica.

## Dados e privacidade

Diário, progresso e favoritos são armazenados apenas no **localStorage do navegador** do cliente. Nenhum dado é enviado a servidores. A exclusão dos dados do navegador apaga registros não exportados. Use a função exportar para fazer backups. O progresso não sincroniza entre dispositivos.
