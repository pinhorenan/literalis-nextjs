# Literalis

Literalis é uma plataforma social voltada para amantes da literatura. Conecte-se com leitores, compartilhe suas leituras, acompanhe seu progresso e descubra novos livros e autores.

## Funcionalidades

* **Feed Personalizado**: Acompanhe as postagens dos usuários que você segue ou descubra novos leitores.
* **Estante Virtual**: Organize e gerencie os livros que você está lendo, já leu ou pretende ler.
* **Progresso de Leitura**: Registre o seu progresso e acompanhe suas estatísticas.
* **Interações Sociais**: Comente, curta e interaja com outros leitores.
* **Sistema de Busca**: Encontre livros e usuários facilmente com uma pesquisa integrada.

## Tecnologias

* **Next.js** com React para frontend
* **Tailwind CSS** para estilização
* **Prisma** como ORM
* **PostgreSQL** como banco de dados
* **NextAuth** para autenticação

## Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/pinhorenan/literalis.git
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias:

```env
DATABASE_URL=URL_DO_SEU_BANCO
NEXTAUTH_SECRET=SUA_CHAVE_SECRETA
```

4. Gere o schema do banco de dados:

```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Agora, a aplicação estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

* `src/app`: Páginas principais do Next.js.
* `src/components`: Componentes React reutilizáveis.
* `src/server`: Código relacionado ao backend (Instância do Prisma, AuthOptions).
* `public`: Arquivos estáticos (imagens, ícones).

## Contribuições

Contribuições são bem-vindas. Abra uma issue caso encontre problemas ou tenha sugestões. Sinta-se à vontade para abrir Pull Requests com melhorias ou novas funcionalidades.

## Licença

Este projeto está sob licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
