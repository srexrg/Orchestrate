import express from 'express';
import {
    createEventHandler,
    getEventByIdHandler,
    updateEventHandler,
    deleteEventHandler,
    getOrganizerEventsHandler,
    checkVenueAvailabilityHandler,
    checkRegistrationAvailabilityHandler
} from '../controllers/event.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = express.Router();

// Public routes
router.post('/venue-availability', checkVenueAvailabilityHandler);
router.get('/:id', getEventByIdHandler);
router.get('/:id/registration-availability', checkRegistrationAvailabilityHandler);

// Protected routes
router.use(verifyToken);


router.post('/', checkRole(['ORGANIZER']), createEventHandler);
router.put('/:id', checkRole(['ORGANIZER']), updateEventHandler);
router.delete('/:id', checkRole(['ORGANIZER']), deleteEventHandler);
router.get('/organizer/events', checkRole(['ORGANIZER']), getOrganizerEventsHandler);

export default router; 