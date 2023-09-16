import { Router } from 'express';
import { BattleController } from '../controllers/battle.controller';

const router = Router();

router.get('/', BattleController.list);
router.post('/', BattleController.startBattle);
router.delete('/:id', BattleController.deleteBattle);
export default router;
