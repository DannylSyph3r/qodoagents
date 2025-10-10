# E-commerce Order Management System

A modern TypeScript-based order management system for e-commerce platforms.

## Features

- User management with role-based access
- Product catalog with inventory tracking
- Order processing and status management
- Payment processing integration
- Real-time notifications
- Analytics and reporting

## Setup

```bash
npm install
npm start
```

## Project Structure

- `src/models/` - Domain models and business entities
- `src/services/` - Business logic and service layer
- `src/api/` - HTTP routes and middleware
- `src/utils/` - Shared utility functions
- `src/types/` - TypeScript type definitions

## Architecture

This system follows a layered architecture:
1. Models layer for data structures
2. Services layer for business logic
3. API layer for HTTP endpoints
4. Utils layer for cross-cutting concerns

## Development

Run in development mode:
```bash
npm start
```

Build for production:
```bash
npm run build
```