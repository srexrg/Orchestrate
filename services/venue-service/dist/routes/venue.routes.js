"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const venue_controller_1 = require("../controllers/venue.controller");
const router = express_1.default.Router();
router.get('/', venue_controller_1.getAllVenuesHandler);
router.get('/available', venue_controller_1.getAvailableVenuesHandler);
router.get('/:id', venue_controller_1.getVenueByIdHandler);
router.use(auth_middleware_1.verifyToken);
router.post('/', (0, role_middleware_1.checkRole)(['ADMIN']), venue_controller_1.createVenueHandler);
router.put('/:id', (0, role_middleware_1.checkRole)(['ADMIN']), venue_controller_1.updateVenueHandler);
router.delete('/:id', (0, role_middleware_1.checkRole)(['ADMIN']), venue_controller_1.deleteVenueHandler);
exports.default = router;
//# sourceMappingURL=venue.routes.js.map