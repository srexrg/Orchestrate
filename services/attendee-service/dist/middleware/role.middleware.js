"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const orchestrate_shared_1 = require("orchestrate-shared");
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new orchestrate_shared_1.ApiError(401, "Unauthorized");
            }
            const hasRequiredRole = roles.some(role => req.user.roles.includes(role));
            if (!hasRequiredRole) {
                throw new orchestrate_shared_1.ApiError(403, "Access denied. Insufficient permissions.");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=role.middleware.js.map