const { Router } = require('express');
const { TarefaController } = require('../controllers/TarefaController');
const { TarefaService } = require('../services/TarefaService');
const { TarefaRepository } = require('../repositories/TarefaRepository');

// "Injeção de dependência" manual: o repositório concreto é escolhido aqui,
// e tudo acima dele (service, controller) só conhece a abstração.
const service = new TarefaService(new TarefaRepository());
const controller = new TarefaController(service);

const router = Router();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.put('/:id', controller.atualizar);
router.patch('/:id/concluir', controller.concluir);
router.delete('/:id', controller.remover);

module.exports = router;