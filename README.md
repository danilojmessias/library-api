# library-api
Este projeto tem como objetivo criar uma API para gerenciamento de livros de uma biblioteca, com funcionalidades para adicionar, atualizar, listar e remover livros, bem como gerenciar empréstimos de livros por usuários.
Matéria de Programação Web, ministrada pelo Prof. Dr. Anisio Silva

## Autor

Danilo José Messias da Silva
BT301438X

## Como Rodar Localmente

Clone o Projeto

```bash
 https://github.com/danilojmessias/library-api.git
```

Crie um .env com este padrão

```bash
 DATABASE_URL="mysql://SeuUsuario:SuaSenha@localhost:3306/seuBD"
```

Instale as dependencias

```bash
  npm install
```

Inicie o Projeto

```bash
  npm run dev
```
Para acessar o Swagger

```bash
  http://localhost:3000/docs
```

Caso queria importar a collection, ela estará disponivel na pasta dist, após a API ficar online.

## Bibliotecas Usadas
- Prisma
- Express
- TSOA
- swagger-ui-express