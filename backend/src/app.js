const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const sanitize = require('./middleware/sanitizer');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000, // Increased for non-functional and performance testing
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.ALLOWED_ORIGINS?.split(',')
].filter(Boolean).flat();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
}));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.http(`${req.method} ${req.originalUrl}`);
        next();
    });
}

app.use(express.json({ limit: '10kb' })); // Body limit is security best practice
app.use(cookieParser());
app.use(sanitize); // Custom XSS sanitizer

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas (CRM_DB)'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Wersel CRM API',
            version: '1.0.0',
            description: 'Production-grade CRM for AI services company',
            contact: {
                name: 'Wersel Engineering',
                email: 'engineering@wersel.ai'
            },
            servers: [{ url: `http://localhost:${process.env.PORT || 3000}/api/v1` }]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Event Handlers
const { registerOpportunityHandlers } = require('./events/handlers/opportunityEventHandlers');
registerOpportunityHandlers();

// Routes
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const accountRoutes = require('./routes/accountRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const searchRoutes = require('./routes/searchRoutes');
const bulkRoutes = require('./routes/bulkRoutes');
const userRoutes = require('./routes/userRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/invitations', invitationRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/bulk', bulkRoutes);
app.use('/api/v1/reports', require('./routes/reportRoutes')); // Register Reports

app.get('/api/v1/auth/register', (req, res) => {
    res.status(403).json({ success: false, message: 'Public registration is disabled. Please contact an administrator for an invitation.' });
});
app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Wersel CRM API', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
