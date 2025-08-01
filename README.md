# Noesis: A Jornada do Conhecimento

![Banner do Projeto Noesis](https://placehold.co/1200x400/3d405b/fdd835?text=NOESIS&font=press-start-2p)

**Versão 2.0 | Concluído em: 01/08/2025**

---

## 📜 Índice

1.  [Sobre o Projeto](#-sobre-o-projeto)
2.  [✨ Funcionalidades Principais](#-funcionalidades-principais)
3.  [🛠️ Tecnologias Utilizadas](#-tecnologias-utilizadas)
4.  [🏗️ Arquitetura](#️-arquitetura)
5.  [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
    * [Pré-requisitos](#pré-requisitos)
    * [Configuração do Backend](#-backend-spring-boot)
    * [Configuração do Frontend](#-frontend-nextjs)
6.  [🗺️ Visão Geral da API](#️-visão-geral-da-api)
7.  [👥 Equipa do Projeto](#-equipa-do-projeto)
8.  [📄 Licença](#-licença)

---

## 📖 Sobre o Projeto

**Noesis** é uma plataforma educacional, interativa e gamificada, concebida para transformar o ensino dos fundamentos da Ciência da Computação. O projeto nasceu da observação de que, enquanto existem inúmeras plataformas para aprender a programar, há uma lacuna de ferramentas que abordem os conceitos teóricos fundamentais — como algoritmos, estruturas de dados e redes — de uma forma lúdica e acessível.

A nossa abordagem combate os métodos de ensino tradicionais e de baixa interatividade. Em Noesis, o conhecimento é forjado em batalhas de lógica:
* **Alunos (Aventureiros):** Exploram um mundo de "Quests" (desafios), onde cada problema exige a escolha da "Carta" (solução) correta para vencer.
* **Professores (Mestres):** Criam "Clãs" (turmas), forjam as suas próprias Quests e guiam os seus Aventureiros na jornada do conhecimento.

O objetivo é tornar o processo de aprendizagem mais dinâmico, engajador e eficiente, alinhado às necessidades do ensino moderno da Ciência da Computação.

---

## ✨ Funcionalidades Principais

* **🛡️ Autenticação e Perfis:** Sistema de registo e login seguro com distinção de perfis (Aluno e Professor). Os utilizadores podem personalizar o seu perfil com nome e avatar.
* **🌍 Quests Globais:** Um conjunto de desafios disponíveis para todos os alunos, permitindo a aprendizagem contínua mesmo fora de um clã.
* **⚔️ Gestão de Clãs (Turmas):** Professores podem criar clãs, gerar códigos de convite únicos e gerir os seus membros. Alunos podem juntar-se a clãs para aceder a conteúdos exclusivos.
* **📜 Gestão de Conteúdo:** Professores podem criar e organizar as suas próprias quests em "Unidades" (módulos) dentro de cada clã.
* **🏆 Ranking e Pontuação:** Um sistema de pontuação que regista as respostas corretas dos alunos. A aplicação conta com um "Salão dos Heróis" que exibe um ranking paginado, incentivando a competição saudável.
* **🃏 Resolução de Quests Interativa:** Uma interface imersiva onde os alunos enfrentam um desafio e escolhem entre várias opções (cartas) para o resolver, recebendo feedback imediato.
* **🎉 Efeitos Multimédia:** Animações de vitória (confetes) e derrota (tremor de ecrã) para aumentar o engajamento e a satisfação do utilizador.

---

## 🛠️ Tecnologias Utilizadas

O projeto segue uma arquitetura cliente-servidor moderna, utilizando tecnologias robustas e escaláveis.

### **Backend (API RESTful)**
* **Linguagem:** Java 21+
* **Framework:** Spring Boot 3
* **Segurança:** Spring Security (Autenticação e Autorização baseada em JWT)
* **Base de Dados:** Spring Data JPA com Hibernate
* **Documentação da API:** SpringDoc (OpenAPI/Swagger)
* **Build Tool:** Maven

### **Frontend (Single Page Application)**
* **Framework:** Next.js 15+ (com App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Gestão de Formulários:** React Hook Form com Zod para validação
* **Cliente HTTP:** Axios

### **Base de Dados**
* **SGBD:** PostgreSQL

---

## 🏗️ Arquitetura

O sistema foi desenhado com uma clara separação de responsabilidades entre o frontend e o backend.

* **Backend:** Segue uma arquitetura em camadas (Controller, Service, Repository) para garantir a organização e manutenibilidade do código. A segurança é gerida centralmente pelo Spring Security, com um filtro JWT customizado que protege os endpoints.
* **Frontend:** Utiliza uma arquitetura baseada em componentes, com uma separação clara entre a UI (componentes), a lógica de negócio (serviços de API) e a gestão de estado.

---

## 🚀 Como Executar o Projeto

Siga estes passos para configurar e executar o ambiente de desenvolvimento localmente.

### Pré-requisitos
* Java JDK 21 ou superior
* Apache Maven 3.8+
* Node.js v18+ e npm
* Uma instância do PostgreSQL a correr localmente

### ☕ Backend (Spring Boot)
1.  **Navegue para a pasta `backend`:**
    ```bash
    cd backend
    ```
2.  **Configure a Base de Dados:**
    * Crie uma base de dados no seu PostgreSQL chamada `noesis`.
    * No ficheiro `src/main/resources/application.properties`, altere as propriedades `spring.datasource.username` e `spring.datasource.password` para corresponder às suas credenciais do PostgreSQL.
3.  **Instale as dependências e execute:**
    ```bash
    mvn spring-boot:run
    ```
* A API estará disponível em `http://localhost:8080`.
* A documentação da API (Swagger UI) estará disponível em `http://localhost:8080/swagger-ui.html`.

### ⚛️ Frontend (Next.js)
1.  **Navegue para a pasta `frontend`:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente:**
    * Crie um ficheiro chamado `.env.local` na raiz da pasta `frontend`.
    * Adicione a seguinte linha, apontando para a sua API do backend:
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:8080
        ```
4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
* A aplicação estará disponível em `http://localhost:3000`.

---

## 🗺️ Visão Geral da API

A API está estruturada em torno de recursos RESTful, com os seguintes grupos de endpoints principais:

* `POST /v1/auth/register`: Cria um novo utilizador.
* `POST /v1/auth/login`: Autentica um utilizador e retorna um token JWT.
* `GET /v1/core/users/ranking`: Retorna o ranking de utilizadores de forma paginada (pode ser filtrado por `clanId`).
* `GET /v1/core/clans/{id}/questions`: Lista as quests de um clã específico.
* `GET /v1/core/questions/{id}`: Busca os detalhes de uma quest.
* `POST /v1/core/options/{id}/choose`: Regista a resposta de um utilizador a uma quest.
* ... e muitos outros para a gestão de Clãs, Unidades, Utilizadores e Quests.

---

## 👥 Equipa do Projeto

* **Desenvolvedores:**
    * Breno Klywer
    * Afonso Simão
    * Fernando Silva
    * Daniel
* **Professor Orientador:**
    * Lenardo Chaves

---
