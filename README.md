# SoftPet - Gerenciador de Pets 🐾

Bem-vindo ao **SoftPet**, a aplicação desenvolvida como parte do Desafio Jr. Este projeto é um dashboard completo para gerenciamento de pets e seus donos, apresentando uma interface moderna, responsiva e performática.

![Dashboard Preview](./public/print-dashboard.png)
_(Adicione um print do dashboard aqui)_

## 🚀 Tecnologias Utilizadas

O projeto foi construído sobre uma stack moderna e robusta, priorizando performance, segurança e experiência do desenvolvedor:

- **[Next.js 15 (App Router)](https://nextjs.org/)**: Framework React principal. Utilizamos o _App Router_ para aproveitar Server Components, Server Actions e gestão eficiente de rotas.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e produtividade.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização _utility-first_ para interfaces rápidas e responsivas.
- **[Shadcn/UI](https://ui.shadcn.com/)**: Coleção de componentes acessíveis e reutilizáveis (construídos com Radix UI).
- **[Prisma ORM](https://www.prisma.io/)**: ORM para comunicação segura e tipada com o banco de dados PostgreSQL.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto.
- **[Zod](https://zod.dev/)**: Validação de schemas (formulários e dados).
- **[React Hook Form](https://react-hook-form.com/)**: Gerenciamento performático de formulários.
- **[Jose](https://github.com/panva/jose)** & **[BcryptJS](https://github.com/dcodeIO/bcrypt.js)**: Autenticação via JWT (Stateless session com Cookies) e hash de senhas.
- **[Vitest](https://vitest.dev/)**: Framework de testes unitários e de integração.

---

## 🏗️ Arquitetura e Decisões de Design

### 1. Server Actions vs API Routes

Optou-se pelo uso massivo de **Server Actions** (`src/actions/`) para mutações de dados (`Create`, `Update`, `Delete`, `Login`). Isso reduz a necessidade de API Routes tradicionais, simplifica o código do cliente e melhora a segurança (execução exclusiva no servidor).

### 2. Server Components (RSC)

A página principal (`page.tsx`) é um Server Component. Ela busca dados diretamente do banco (via Prisma) antes de enviar o HTML para o navegador. Isso garante:

- **SEO**: Conteúdo indexável.
- **Performance**: Menos JavaScript enviado para o cliente.
- **Segurança**: Credenciais de banco nunca vazam.

### 3. Autenticação Segura

A autenticação utiliza **JWT (JSON Web Tokens)** armazenados em cookies `HTTP-Only` e `Secure`.

- Middleware (`src/middleware.ts`) protege rotas privadas.
- Ações protegidas verificam o token e se o usuário é o dono do recurso (`ownerId`) antes de permitir edições/exclusões.

### 4. Paginação e Busca Otimizada

- **Busca em Tempo Real**: Implementada via URL (`?q=Termo`). Um componente cliente (`SearchBar`) atualiza a URL, e o componente servidor refiltra os dados.
- **Paginação Server-Side**: O banco retorna apenas 16 itens por vez (`take: 16`), garantindo que a aplicação escale para milhares de registros sem travar.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- Node.js 18+
- Docker (opcional, para rodar o banco) ou uma instância PostgreSQL local/remota.

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/gabnunesdev/desafio-jr.git
    cd desafio-jr
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz (baseado no exemplo abaixo):

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/petshop?schema=public"
    JWT_SECRET="sua_chave_secreta_super_segura"
    ```

4.  **Suba o Banco de Dados (Docker):**

    ```bash
    docker-compose up -d
    ```

5.  **Execute as Migrations do Prisma:**

    ```bash
    npx prisma migrate dev
    ```

6.  **Popule o Banco (Seed - Opcional):**
    Gera 50 pets para teste.

    ```bash
    npx prisma db seed
    ```

7.  **Rode a Aplicação:**
    ```bash
    npm run dev
    ```
    Acesse [`http://localhost:3000`](http://localhost:3000).

---

## ✅ Funcionalidades Principais

- **Cadastro/Login de Usuários**: Proteção completa das rotas.
- **Dashboard de Pets**: Visualização em grid com cards modernos.
- **CRUD Completo**: Criar, Editar (apenas seus pets) e Remover pets.
- **Busca Inteligente**: Filtre por nome do pet ou nome do dono instantaneamente.
- **Paginação**: Navegue por grandes volumes de dados.
- **Responsividade**: Layout adaptável para Desktop e Mobile.

---

## 📸 Screenshots

| Login                                 | Cadastro                                         |
| ------------------------------------- | ------------------------------------------------ |
| ![Login](./public/01%20-%20login.png) | ![Cadastro](./public/02%20-%20register-user.png) |

| Dashboard                                     | Card Pet                                             |
| --------------------------------------------- | ---------------------------------------------------- |
| ![Dashboard](./public/03%20-%20dashboard.png) | ![Card Pet](./public//04%20-%20pet-card-wrapper.png) |

| Cadastrar Pet Pet                             | Edição de Pet                             |
| --------------------------------------------- | ----------------------------------------- |
| ![Create](./public/05%20-%20register-pet.png) | ![Editar Pet](./public/06%20-%20edit.png) |

| Remover Pet  
| ------------------------------------
| ![Remover Pet](./public/07%20-%20delete-pet.png)

---

Desenvolvido por Gabriel Nunes 🚀
