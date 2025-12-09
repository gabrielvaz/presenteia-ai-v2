# 🎁 Presenteia.AI (v2) - Encontre o Presente Perfeito

![Presenteia AI Banner](https://placehold.co/1200x400/8b5cf6/ffffff?text=Presenteia.AI+v2)

**Presenteia.AI** é uma aplicação web inteligente que revoluciona a forma de presentear. Analisamos perfis públicos do Instagram usando IA avançada para entender a personalidade, interesses e estilo de vida da pessoa, e sugerimos produtos curados de um catálogo real (Amazon), com justificativas personalizadas para cada recomendação.

🔗 **Demo em Produção**: [https://presenteia-ai-v2.vercel.app](https://presenteia-ai-v2.vercel.app)

---

## ✨ Funcionalidades Principais

*   **🕵️ Análise de Perfil com IA**: Extrai insights de posts, legendas e biografia do Instagram (via Apify) para criar um perfil psicográfico.
*   **🛍️ Catálogo Inteligente**: Matching com produtos reais da Amazon, armazenados em banco de dados Neon (PostgreSQL).
*   **🤖 Recomendações Explicadas**: Cada sugestão vem com um "Por que este presente?", gerado por LLM (OpenRouter/Gemini), conectando o produto aos interesses da pessoa.
*   **🔄 Fallback Robusto & Dados Sintéticos**: Sistema resiliente que utiliza dados de fallback (mock) caso a API do Instagram falhe ou o perfil seja privado, garantindo que o usuário sempre tenha uma experiência completa.
*   **🎨 UI Premium & Responsiva**: Interface moderna construída com Shadcn/UI, Tailwind CSS e animações suaves.
*   **🧪 Testes E2E**: Cobertura de fluxos críticos com Playwright.

---

## 🚀 Tecnologias Utilizadas

### Frontend
*   **Next.js 15** (App Router)
*   **TypeScript**
*   **Tailwind CSS**
*   **Shadcn/UI** (Componentes acessíveis)
*   **Framer Motion** (Animações)
*   **Lucide React** (Ícones)

### Backend & Dados
*   **Node.js Serverless Functions** (Next.js API Routes)
*   **Neon DB** (Serverless PostgreSQL)
*   **Drizzle ORM** (Gestão de esquemas e queries type-safe)
*   **OpenRouter API** (LLM - Gemini Flash 2.5)
*   **Apify** (Instagram Scraper)

---

## 📦 Como Rodar Localmente

### Pré-requisitos
*   Node.js 18+
*   npm ou pnpm
*   Conta no Neon (para o DB)

### 1. Instalação
```bash
git clone https://github.com/gabrielvaz/presenteia-ai-v2.git
cd presenteia-ai-v2/gift-ai
npm install
```

### 2. Configuração de Variáveis (.env.local)
Crie o arquivo `.env.local` na raiz (`/gift-ai`) e preencha:

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:..."

# APIs de Inteligência (Essenciais)
OPENROUTER_API_KEY="sk-or-..." 
APIFY_API_TOKEN="apify_api_..."

# Opcional (Se usar Google Generative AI direto)
GOOGLE_API_KEY="..."
```

### 3. Popular Banco de Dados (Seed)
O projeto inclui um script de seed que popula o banco com **500+ produtos sintéticos** (baseados em dados reais da Amazon) para testes robustos.

```bash
# Executa o crawler/seeder sintético
npm run seed
```
*Isso criará a tabela `products` e inserirá itens variados (Tech, Casa, Livros, etc) com preços e categorias.*

### 4. Executar o Projeto
```bash
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testes Automatizados (E2E)

O projeto utiliza **Playwright** para garantir a qualidade dos fluxos principais.

```bash
# Instalar navegadores do Playwright (apenas na 1ª vez)
npx playwright install

# Rodar todos os testes
npx playwright test

# Rodar em modo UI (interativo)
npx playwright test --ui
```

---

## ☁️ Deploy na Vercel

O projeto é "Vercel-native". Para colocar em produção:

1.  Faça fork deste repositório.
2.  Crie um novo projeto na **Vercel**.
3.  Conecte ao seu repositório Git.
4.  **Importante**: Adicione as variáveis de ambiente (`DATABASE_URL`, `OPENROUTER_API_KEY`, `APIFY_API_TOKEN`) nas configurações do projeto na Vercel.
5.  Clique em **Deploy**.

---

## 📂 Estrutura de Pastas

```
gift-ai/
├── src/
│   ├── app/                 # Next.js App Router (Páginas)
│   │   ├── page.tsx         # Landing Page
│   │   ├── wizard/          # Fluxo de perguntas
│   │   ├── results/         # Tela de resultados
│   │   └── api/             # Endpoints (analyze, products)
│   ├── components/
│   │   ├── gift-ai/         # Componentes do Negócio (Cards, Status)
│   │   └── ui/              # Componentes Base (Shadcn)
│   ├── lib/
│   │   ├── db/              # Schema Drizzle & Conexão Neon
│   │   ├── apify.ts         # Integração Instagram
│   │   └── openrouter.ts    # Integração IA
├── e2e/                     # Testes Playwright
├── scripts/                 # Scripts de manutenção (Seed, Crawl)
└── public/                  # Assets estáticos (Imagens, Fallbacks)
```

---

## 📄 Licença

Este projeto é open-source sob a licença MIT. Sinta-se livre para usar e modificar.

**Desenvolvido por Gabriel Vaz** 🚀
