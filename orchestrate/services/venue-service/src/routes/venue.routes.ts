import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import {
    createVenueHandler,
    getVenueByIdHandler,
    updateVenueHandler,
    deleteVenueHandler,
    getAllVenuesHandler,
    getAvailableVenuesHandler
} from '../controllers/venue.controller';

const router = express.Router();


router.get('/', getAllVenuesHandler);
router.get('/:id', getVenueByIdHandler);
router.get('/available', getAvailableVenuesHandler);

router.use(verifyToken);

router.post('/', checkRole(['ADMIN']), createVenueHandler);
router.put('/:id', checkRole(['ADMIN']), updateVenueHandler);
router.delete('/:id', checkRole(['ADMIN']), deleteVenueHandler);

export default router; 