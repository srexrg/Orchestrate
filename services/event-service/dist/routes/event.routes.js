"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = express_1.default.Router();
router.get('/:id', event_controller_1.getEventByIdHandler);
router.use(auth_middleware_1.verifyToken);
router.post('/', (0, role_middleware_1.checkRole)(['ORGANIZER']), event_controller_1.createEventHandler);
router.put('/:id', (0, role_middleware_1.checkRole)(['ORGANIZER']), event_controller_1.updateEventHandler);
router.delete('/:id', (0, role_middleware_1.checkRole)(['ORGANIZER']), event_controller_1.deleteEventHandler);
router.get('/organizer/events', (0, role_middleware_1.checkRole)(['ORGANIZER']), event_controller_1.getOrganizerEventsHandler);
exports.default = router;
//# sourceMappingURL=event.routes.js.map