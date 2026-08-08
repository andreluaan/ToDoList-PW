# To-Do List — API CRUD + Front-end Básico

Projeto da disciplina de Programação Web — aplicação prática dos **Quatro Pilares da POO** (Encapsulamento, Herança, Polimorfismo, Abstração) e dos princípios **SOLID** em um sistema full stack simples.

## 💡 Ideia do projeto

Uma aplicação de lista de tarefas (to-do list) onde o usuário pode criar, visualizar, atualizar e excluir tarefas, organizá-las em categorias e marcá-las como concluídas. O back-end expõe uma API REST; o front-end consome essa API com HTML/CSS/Bootstrap puro (sem framework JS).

## 🧱 Modelagem do domínio

A modelagem completa (classes, aplicação de **SRP**, indicação de **DIP** e diagrama) está em [`docs/modelagem.md`](docs/modelagem.md). Resumo rápido:

| Classe/Interface     | Papel                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `Tarefa`                | Entidade — estado e transições da tarefa (`concluir()`, `reabrir()`)   |
| `Categoria`             | Entidade — nome/cor da categoria                                      |
| `Usuario`               | Entidade — identidade do usuário                                      |
| `ITarefaRepository`     | Abstração — contrato de persistência (usado para aplicar DIP)         |
| `TarefaRepository`      | Implementação concreta de `ITarefaRepository`                         |
| `TarefaService`         | Regra de negócio — depende de `ITarefaRepository`, não da implementação |
| `TarefaController`      | Camada HTTP — traduz requisição ↔ chamada ao `TarefaService`          |

### Onde entram os pilares da POO

- **Encapsulamento**: atributos da `Tarefa` (ex: `status`) só mudam por métodos como `concluir()`, `reabrir()` — nunca por atribuição direta.
- **Herança**: possível `TarefaRecorrente extends Tarefa` para tarefas que se repetem.
- **Polimorfismo**: método `descrever()` implementado de forma diferente em `Tarefa` e `TarefaRecorrente`.
- **Abstração**: `ITarefaRepository` define o contrato (`salvar`, `buscarPorId`, `listar`, `remover`) sem expor como os dados são persistidos — base do DIP, detalhado em `docs/modelagem.md`.

## 🛠️ Stack

- **Back-end**: Node.js + Express
- **Front-end**: HTML5, CSS3, Bootstrap
- **Arquitetura**: camadas (routes → controllers → services → repositories → models), aplicando SOLID
- **Deploy**: a definir (Render / Railway para API, Vercel/Netlify ou o próprio Express servindo estático para o front)
