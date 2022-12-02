const express = require('express');
const router = express.Router();
import KnightController from '../../app/controllers/Knight.controller';
router.post('/knight/store',KnightController.storeKnight.bind(KnightController));
router.get('/knight/get-all', KnightController.getKnightsOfOwner);
router.get('/knight/get-knight-id', KnightController.getKnightById);
router.get('/knight/knight-not-owner', KnightController.getKnightNotOwner);

router.get('/knight/sale-knight', KnightController.getSaleKnight);
router.post('/knight/sale-knight', KnightController.storeSaleKnight);
router.put('/knight/sale-knight', KnightController.buySaleKnight);
router.delete('/knight/sale-knight', KnightController.destroySaleKnight);

router.post('/knight/request-marry',KnightController.storeRequestMarry);
router.get('/knight/request-marry', KnightController.getRequestMarry);
router.put('/knight/request-marry', KnightController.updateRequestMarry);
router.delete('/knight/request-marry', KnightController.destroyMarry);

router.post('/knight/level-up', KnightController.levelUp);
router.post('/knight/change-name', KnightController.changeName);
router.post('/knight/battle-result', KnightController.battleResults);
router.post('/knight/trigger-cooldown', KnightController.triggerCoolDown);
router.post('/knight/trigger-tired', KnightController.triggerTired);
router.post('/knight/tranfer', KnightController.transferFrom);
router.get('/knight/all', KnightController.allKnight);
router.get('/knight/sale-knight-biggest', KnightController.saleMaxKnight);
router.get('/knight/sale-knight-after-biggest', KnightController.saleMediumKnight);

export default router;