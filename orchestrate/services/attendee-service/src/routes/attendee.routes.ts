import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import {
    registerAttendeeHandler,
    getEventAttendeesHandler,
    getUserEventsHandler,
    cancelRegistrationHandler,
    checkRegistrationStatusHandler
} from '../controllers/attendee.controller';

const router = express.Router();

router.use(verifyToken);

router.get('/event/:eventId', checkRole(['ORGANIZER']), getEventAttendeesHandler);
router.post('/register', checkRole(['ATTENDEE']), registerAttendeeHandler);
router.get('/user/events', checkRole(['ATTENDEE']), getUserEventsHandler);
router.delete('/event/:eventId', checkRole(['ATTENDEE']), cancelRegistrationHandler);
router.get('/event/:eventId/status', checkRole(['ATTENDEE']), checkRegistrationStatusHandler);

export default router; 