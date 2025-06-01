orchestrate/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.middleware.ts
│   │   │   ├── interfaces/
│   │   │   │   └── auth.ts
│   │   │   ├── utils/
│   │   │   │   └── prisma.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── event-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── event.controller.ts
│   │   │   ├── services/
│   │   │   │   └── event.service.ts
│   │   │   ├── routes/
│   │   │   │   └── event.routes.ts
│   │   │   ├── middleware/
│   │   │   ├── interfaces/
│   │   │   ├── utils/
│   │   │   │   └── prisma.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── venue-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── venue.controller.ts
│   │   │   ├── services/
│   │   │   │   └── venue.service.ts
│   │   │   ├── routes/
│   │   │   │   └── venue.routes.ts
│   │   │   ├── utils/
│   │   │   │   └── prisma.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── attendee-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── attendee.controller.ts
│   │   │   ├── services/
│   │   │   │   └── attendee.service.ts
│   │   │   ├── routes/
│   │   │   │   └── attendee.routes.ts
│   │   │   ├── utils/
│   │   │   │   └── prisma.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── api-gateway/
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.routes.ts
│       │   │   ├── event.routes.ts
│       │   │   ├── venue.routes.ts
│       │   │   └── attendee.routes.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   └── proxy.middleware.ts
│       │   ├── utils/
│       │   │   └── serviceDiscovery.ts
│       │   └── index.ts
│       ├── .env
│       ├── package.json
│       ├── tsconfig.json
│       └── Dockerfile
│
├── shared/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── docker-compose.yml
├── tsconfig.json (root - for workspace configuration)
├── package.json (root - for workspace scripts)
├── .gitignore
├── .env.example
└── README.md