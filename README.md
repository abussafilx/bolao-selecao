# Bolão da Seleção 2025

Site de bolão para a convocação da Seleção Brasileira.
Base de dados via **Netlify Blobs** (key-value nativo do Netlify).

## Estrutura

```
bolao-selecao/
├── index.html                  ← Frontend completo
├── netlify.toml                ← Config do Netlify
└── netlify/functions/
    ├── entries.js              ← API: palpites (GET/POST/DELETE)
    └── gabarito.js             ← API: gabarito (GET/POST/DELETE)
```

## Deploy

### 1. Criar repositório no GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SEU_USER/bolao-selecao.git
git push -u origin main
```

### 2. Ligar ao Netlify

1. Vai a [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Escolhe **GitHub** e seleciona o repositório
3. Build settings ficam automáticos pelo `netlify.toml`
4. Clica **Deploy site**

### 3. Ativar Netlify Blobs

O Netlify Blobs é ativado automaticamente em qualquer site com Functions.
Não precisas de configurar nada extra.

## Endpoints da API

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/api/entries` | Lista todos os palpites |
| POST | `/api/entries` | Cria novo palpite `{nome, picks[26]}` |
| DELETE | `/api/entries` | Remove palpite `{id}` |
| GET | `/api/gabarito` | Retorna gabarito atual |
| POST | `/api/gabarito` | Guarda gabarito `{picks[25]}` |
| DELETE | `/api/gabarito` | Limpa gabarito |

## Regras do bolão

- Lista de 55 pré-convocados
- Cada participante escolhe **26 jogadores**
- O gabarito tem **25 jogadores** (a convocação oficial)
- Ganha quem tiver mais acertos
