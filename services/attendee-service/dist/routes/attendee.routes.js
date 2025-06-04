"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const attendee_controller_1 = require("../controllers/attendee.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.verifyToken);
router.get('/event/:eventId', (0, role_middleware_1.checkRole)(['ORGANIZER']), attendee_controller_1.getEventAttendeesHandler);
router.post('/register', (0, role_middleware_1.checkRole)(['ATTENDEE']), attendee_controller_1.registerAttendeeHandler);
router.get('/user/events', (0, role_middleware_1.checkRole)(['ATTENDEE']), attendee_controller_1.getUserEventsHandler);
router.delete('/event/:eventId', (0, role_middleware_1.checkRole)(['ATTENDEE']), attendee_controller_1.cancelRegistrationHandler);
router.get('/event/:eventId/status', (0, role_middleware_1.checkRole)(['ATTENDEE']), attendee_controller_1.checkRegistrationStatusHandler);
router.get('/event/:eventId/availability', attendee_controller_1.checkRegistrationAvailabilityHandler);
exports.default = router;
//# sourceMappingURL=attendee.routes.js.map