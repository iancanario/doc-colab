# Doc Colab API

API desenvolvida como parte de um **teste técnico** para gestão de documentos de funcionários. A aplicação permite definir os documentos exigidos, associá-los a funcionários, registrar os envios e acompanhar pendências.

O foco do projeto é demonstrar organização de uma API NestJS, regras de negócio transacionais, persistência relacional, documentação de endpoints, validação de dados, tratamento de erros e testes automatizados.

## Funcionalidades

- Cadastro, consulta, atualização e remoção lógica de funcionários.
- Cadastro e remoção lógica de tipos de documento, como CPF ou RG.
- Criação automática de requisitos documentais ao cadastrar um funcionário.
- Atualização dos requisitos quando os tipos de documento de um funcionário mudam.
- Registro de documentos enviados por requisito, com versionamento e desativação da versão anterior.
- Consulta paginada de requisitos pendentes, com filtros por funcionário e tipo de documento.
- Indicadores de documentos enviados e dos tipos com mais pendências.
- Health checks da aplicação, banco de dados e uso de memória.
- Documentação interativa com Swagger.

## Stack

- Node.js e TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Swagger / OpenAPI
- Jest e Supertest
- Docker Compose para o banco de dados local

## Modelo de domínio

```text
Funcionário 1 ── N Requisitos de documento N ── 1 Tipo de documento
                         |
                         1
                         |
                         N
                    Documentos enviados
```

Um requisito representa a obrigação de um funcionário enviar um tipo documental. Ao enviar um novo documento para o mesmo requisito, a versão anterior é marcada como inativa e uma nova versão é criada.

Os registros utilizam *soft delete*. Requisitos ativos também possuem uma restrição de unicidade para impedir mais de um requisito ativo para o mesmo par funcionário/tipo de documento.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose, ou uma instância PostgreSQL 16 compatível

## Configuração e execução

Instale as dependências:

```bash
npm install
```

Suba o PostgreSQL local com Docker:

```bash
docker compose up -d db
```

Configure o arquivo `.env` com as credenciais do banco:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=sua_senha
DB_NAME=doc-colab
```

Execute as migrations e inicie a API em modo de desenvolvimento:

```bash
npm run migration:run
npm run start:dev
```

A API estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.

## Migrations

O `synchronize` está desabilitado para que a evolução do schema seja versionada e reproduzível entre ambientes.

```bash
# Gerar uma migration após alterar entidades
npm run migration:generate -- src/common/database/migrations/NomeDaAlteracao

# Aplicar migrations pendentes
npm run migration:run

# Listar migrations e seu status
npm run migration:show

# Reverter a última migration aplicada
npm run migration:revert
```

## Endpoints principais

| Recurso | Métodos e rotas |
| --- | --- |
| Funcionários | `POST /employees`, `GET /employees`, `GET /employees/by-id/:id`, `PATCH /employees/:id`, `DELETE /employees/:id` |
| Tipos de documento | `POST /document-types`, `GET /document-types`, `DELETE /document-types/:id` |
| Documentos | `POST /documents`, `GET /documents/find-last-sents`, `DELETE /documents/:id` |
| Requisitos | `GET /requirements/pendings`, `GET /requirements/percentual-pendings`, `GET /requirements/most-pendings` |
| Saúde | `GET /health`, `GET /health/live`, `GET /health/database` |

Exemplo de criação de funcionário:

```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "documentTypeIds": [1, 2]
}
```

Exemplo de envio de documento:

```json
{
  "employeeId": "468b2024-2b65-42c7-bc60-1b527529321d",
  "requirementId": 1,
  "documentUrl": "https://storage.example.com/documentos/cpf.pdf"
}
```

## Qualidade e decisões técnicas

- As operações que criam ou atualizam funcionário e requisitos, assim como o envio de documentos, são executadas em transações.
- As regras são separadas em controller, service e repository, com contratos de dependência para facilitar testes unitários.
- DTOs usam `class-validator`; exceções HTTP e erros conhecidos do PostgreSQL possuem respostas padronizadas.
- As relações e consultas mais frequentes contam com índices parciais voltados a requisitos pendentes e documentos ativos.
- A API não recebe arquivos binários: ela persiste a URL do documento. Em produção, o upload pode ser integrado a um serviço de armazenamento de objetos.

## Testes e validação

```bash
# Testes unitários
npm run test

# Cobertura
npm run test:cov

# Testes end-to-end
npm run test:e2e

# Build de produção
npm run build
```

## Próximos passos

- Adicionar autenticação e autorização por perfil.
- Integrar upload de arquivos a um storage externo.
- Expandir testes de integração usando um banco isolado.
- Adicionar ordenação explícita às listagens paginadas e contratos de resposta mais detalhados.
