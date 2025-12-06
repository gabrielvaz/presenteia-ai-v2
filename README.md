# 🎁 Presenteia.AI (v2)

**Presenteia.AI** é uma aplicação web inteligente que ajuda você a encontrar o presente ideal analisando perfis do Instagram. Utilizando Inteligência Artificial e dados reais de produtos, o sistema sugere presentes personalizados baseados nos interesses, estilo de vida e preferências do presenteado.

## 🎯 Objetivo
Facilitar a escolha de presentes assertivos através da análise de dados públicos (Instagram) e matching inteligente com um catálogo de produtos curado, oferecendo uma experiência de usuário fluida e divertida.

## 🚀 Tecnologias

### Frontend
- **Framework**: [Next.js 14-15](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Shadcn/UI
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: React Context API (`GiftContext`)

### Backend & AI
- **API Routes**: Next.js Serverless Functions
- **Database**: [Neon](https://neon.tech/) (PostgreSQL) - Armazena catálogo de produtos.
- **Scraping**: [Apify](https://apify.com/) (Instagram Scraper) - Analisa perfil público.
- **LLM**: [OpenRouter](https://openrouter.ai/) (Gemini Flash 2.5) - Gera o matching e justificativas.

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Chaves de API (ver abaixo)

### 1. Instalação
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/gabrielvaz/presenteia-ai-v2.git
cd presenteia-ai-v2/gift-ai
npm install
```

### 2. Configuração de Ambiente
Crie um arquivo `.env.local` na raiz da pasta `gift-ai` com as seguintes variáveis:
```env
# Banco de Dados (Neon)
DATABASE_URL="postgresql://neondb_owner:..."

# APIs Externas
APIFY_API_TOKEN="seu_token_apify"
OPENROUTER_API_KEY="sua_chave_openrouter"

# Opcional (Google SDK direto)
GOOGLE_API_KEY="..."
```

### 3. Banco de Dados (Seed)
Para popular o banco de dados com os produtos iniciais (Amazon BR):
```bash
npm run seed
```

### 4. Executar
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

## 🛠️ Estrutura do Projeto

- `/src/app`: Rotas da aplicação (`/`, `/wizard`, `/results`).
- `/src/components/gift-ai`: Componentes UI específicos (Cards, Wizard, Loading).
- `/src/context`: Gerenciamento de estado global.
- `/src/lib`: Lógica de negócios (`apify.ts`, `openrouter.ts`) e conexão DB.

## ❓ FAQ (Perguntas Frequentes)

### 1. Por que as vezes recebo dados "simulados" (Mock)?
O sistema possui um mecanismo de fallback robusto. Se a API do Instagram (Apify) atingir o limite de quota mensal ou falhar, o sistema utiliza dados simulados para garantir que você ainda possa testar o fluxo de UI e ver como os resultados seriam apresentados. O mesmo vale para a IA.

### 2. Como adicionar mais produtos?
Os produtos ficam no banco de dados Neon. Você pode editar o arquivo `src/lib/products_seed.json` e rodar o script de seed novamente, ou conectar diretamente no banco via SQL para inserir novos itens.

### 3. O sistema salva os dados do perfil?
Não. A análise é feita em tempo real e mantida apenas na sessão do usuário (memória do navegador). Nada é salvo permanentemente sobre o perfil analisado.

### 4. Funciona com perfis privados?
Não. O scraper do Instagram só consegue acessar dados de perfis públicos.

## ☁️ Deploy (Vercel)

Este projeto está otimizado para a Vercel.
1. Crie um novo projeto na Vercel.
2. Importe este repositório do GitHub.
3. Adicione as variáveis de ambiente (`DATABASE_URL`, `APIFY_API_TOKEN`, `OPENROUTER_API_KEY`) nas configurações do projeto na Vercel.
4. Faça o Deploy.

---
Desenvolvido com ❤️ por Gabriel Vaz & Gift AI Team.
