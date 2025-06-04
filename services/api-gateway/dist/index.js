"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Essential middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Service routes with proxy
app.use('/api/auth', (0, express_http_proxy_1.default)(process.env.AUTH_SERVICE_URL || 'http://localhost:3001', {
    proxyReqPathResolver: (req) => req.url.replace('/api/auth', '')
}));
app.use('/api/events', (0, express_http_proxy_1.default)(process.env.EVENT_SERVICE_URL || 'http://localhost:3002', {
    proxyReqPathResolver: (req) => req.url.replace('/api/events', '')
}));
app.use('/api/venues', (0, express_http_proxy_1.default)(process.env.VENUE_SERVICE_URL || 'http://localhost:3003', {
    proxyReqPathResolver: (req) => req.url.replace('/api/venues', '')
}));
app.use('/api/attendees', (0, express_http_proxy_1.default)(process.env.ATTENDEE_SERVICE_URL || 'http://localhost:3004', {
    proxyReqPathResolver: (req) => req.url.replace('/api/attendees', '')
}));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map