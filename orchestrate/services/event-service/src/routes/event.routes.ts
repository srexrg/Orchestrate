import express from 'express';
import {
    createEventHandler,
    getEventByIdHandler,
    updateEventHandler,
    deleteEventHandler,
    createTicketHandler,
    getOrganizerEventsHandler
} from '../controllers/event.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = express.Router();

router.get('/:id', getEventByIdHandler);


router.use(verifyToken);


router.post('/', checkRole(['ORGANIZER']), createEventHandler);
router.put('/:id', checkRole(['ORGANIZER']), updateEventHandler);
router.delete('/:id', checkRole(['ORGANIZER']), deleteEventHandler);
router.get('/organizer/events', checkRole(['ORGANIZER']), getOrganizerEventsHandler);

router.post('/:id/tickets', checkRole(['ATTENDEE']), createTicketHandler);

export default router; 