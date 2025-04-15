import express from 'express';
import {
    createEventHandler,
    getEventByIdHandler,
    updateEventHandler,
    deleteEventHandler,
    createVenueHandler,
    createTicketHandler,
    getOrganizerEventsHandler
} from '../controller/event.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();


router.get('/:id', getEventByIdHandler);


router.use(verifyToken);


router.post('/', createEventHandler);
router.put('/:id', updateEventHandler);
router.delete('/:id', deleteEventHandler);
router.get('/organizer/events', getOrganizerEventsHandler);


router.post('/venues', createVenueHandler);


router.post('/tickets', createTicketHandler);

export default router; 