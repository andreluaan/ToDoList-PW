# To-Do List — API CRUD + Front-end Básico

Projeto da disciplina de Programação Web — aplicação prática dos **Quatro Pilares da POO** (Encapsulamento, Herança, Polimorfismo, Abstração) e dos princípios **SOLID** em um sistema full stack simples.

## 💡 Ideia do projeto

Uma aplicação de lista de tarefas (to-do list) onde o usuário pode criar, visualizar, atualizar e excluir tarefas, organizá-las em categorias e marcá-las como concluídas. O back-end expõe uma API REST; o front-end consome essa API com HTML/CSS/Bootstrap puro (sem framework JS).

## 🧱 Modelagem do domínio (rascunho — Aula 1)

Classes iniciais identificadas:

| Classe       | Responsabilidade                                                                 |
|--------------|----------------------------------------------------------------------------------|
| `Usuario`    | Representa quem usa o sistema (nome, e-mail, autenticação futura)                |
| `Tarefa`     | Entidade principal: título, descrição, status, prioridade, data de vencimento    |
| `Categoria`  | Agrupa tarefas por contexto (ex: Trabalho, Pessoal, Estudos)                     |
| `ListaDeTarefas` | Coleção de tarefas de um usuário; concentra regras de negócio (adicionar, filtrar, concluir) |
| `StatusTarefa` (enum/classe) | Define os estados possíveis: `pendente`, `em_andamento`, `concluida` |

### Relações entre as classes

- **Usuario → ListaDeTarefas**: **composição** (tem-um forte). Se o usuário deixa de existir, sua lista também deixa.
- **ListaDeTarefas → Tarefa**: **composição** (tem-um forte). Uma tarefa não existe fora de uma lista.
- **Tarefa → Categoria**: **associação**. Uma categoria existe independentemente das tarefas que a usam.
- **Tarefa → StatusTarefa**: **associação/uso**. O status é um valor que a tarefa referencia, não "possui" no sentido forte.

### Onde entram os pilares da POO

- **Encapsulamento**: atributos da `Tarefa` (ex: `status`) só mudam por métodos como `concluir()`, `reabrir()` — nunca por atribuição direta.
- **Herança**: possível `TarefaRecorrente extends Tarefa` para tarefas que se repetem.
- **Polimorfismo**: método `descrever()` implementado de forma diferente em `Tarefa` e `TarefaRecorrente`.
- **Abstração**: uma classe abstrata `Repositorio` define o contrato (`salvar`, `buscarPorId`, `listar`, `remover`) implementado depois por `TarefaRepository` — isso já prepara o terreno para SOLID (Dependency Inversion).

## 🛠️ Stack

- **Back-end**: Node.js + Express
- **Front-end**: HTML5, CSS3, Bootstrap
- **Arquitetura**: camadas (routes → controllers → services → repositories → models), aplicando SOLID
- **Deploy**: a definir (Render / Railway para API, Vercel/Netlify ou o próprio Express servindo estático para o front)
