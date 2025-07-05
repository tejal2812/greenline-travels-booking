# Bus Booking System

## Overview

This is a comprehensive bus booking system built as a full-stack web application. The system provides a modern, user-friendly interface for customers to search, view, and book bus tickets, with plans for admin functionality to manage routes, schedules, and bookings.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router for client-side navigation
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Comprehensive set of accessible components using Radix UI primitives
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API structure with `/api` prefix
- **Session Management**: Session-based authentication setup

### Development Setup
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Hot Reload**: Vite dev server with HMR support
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared types

## Key Components

### Frontend Components
- **Pages**: Home (Index), Search, Bus Details, Booking, Dashboard, Admin, 404
- **UI Library**: Complete shadcn/ui component set including forms, dialogs, tables, charts
- **Navigation**: Responsive header with mobile menu support
- **Theming**: CSS custom properties for consistent design system

### Backend Components
- **Routes**: Modular route registration system
- **Storage**: Abstracted storage interface with in-memory implementation
- **Database**: Drizzle ORM with migration support
- **Error Handling**: Centralized error handling middleware

### Shared Components
- **Schema**: Shared database schema and validation using Drizzle and Zod
- **Types**: Common TypeScript interfaces for data models

## Data Flow

### Current Implementation
1. **Mock Data**: Frontend uses mock data for bus routes, schedules, and bookings
2. **In-Memory Storage**: Backend uses in-memory storage for user management
3. **State Management**: React Query handles client-side caching and synchronization

### Planned Database Integration
1. **User Authentication**: Users register/login through backend API
2. **Bus Search**: Frontend queries backend for available buses based on search criteria
3. **Booking Flow**: Selected seats and passenger details sent to backend for booking creation
4. **Payment Integration**: Payment processing through external gateway
5. **Admin Management**: CRUD operations for buses, routes, and booking management

## External Dependencies

### Core Dependencies
- **UI Framework**: React, React Router, TanStack Query
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Drizzle ORM, Neon Database connector
- **Backend**: Express.js, TypeScript execution (tsx)
- **Validation**: Zod for schema validation

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **Development**: Replit-specific plugins for development environment
- **Type Checking**: TypeScript compiler

### Planned Integrations
- **Payment Gateway**: For processing ticket payments
- **Email Service**: For booking confirmations and notifications
- **SMS Service**: For booking alerts and updates

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server for frontend, tsx for backend hot reload
- **Database**: Neon Database connection via environment variables
- **Asset Handling**: Vite handles static assets and bundling

### Production Build
- **Frontend**: Vite build creates optimized static assets
- **Backend**: esbuild bundles server code for Node.js execution
- **Database**: Drizzle migrations for schema deployment
- **Environment**: Production configuration via NODE_ENV

### Database Management
- **Migrations**: Drizzle Kit for database schema versioning
- **Schema**: Centralized schema definition in shared directory
- **Connection**: Serverless PostgreSQL via Neon Database

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

- July 05, 2025: Successfully migrated from Lovable to Replit environment
  - Replaced react-router-dom with wouter for client-side routing
  - Migrated from Supabase to PostgreSQL with Drizzle ORM
  - Created comprehensive database schema with all bus booking entities
  - Implemented RESTful API endpoints for all major operations
  - Set up proper client/server separation with secure PostgreSQL connection
  - Removed all Supabase dependencies and client-side database calls
- July 05, 2025: Initial setup