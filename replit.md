# Overview

DataLens is a full-stack data analytics application that provides natural language to SQL query translation and data visualization capabilities. The application allows users to connect to databases, write queries in plain English that get converted to SQL, execute those queries, and visualize the results through interactive charts and dashboards.

The system is built as a modern web application with a React frontend and Express.js backend, featuring real-time query execution, chart generation, and dashboard management functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and dark theme support
- **Charts**: Chart.js integration for data visualization (line, bar, pie charts)
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured error handling and request logging
- **Development Setup**: Vite middleware integration for hot module replacement in development
- **File Structure**: Separate routing system with service layer architecture
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database service)
- **Schema Management**: Shared schema definitions between frontend and backend
- **Migrations**: Drizzle Kit for database schema migrations
- **Validation**: Zod schemas for runtime type validation

## Core Data Models
- **Users**: Basic user authentication system
- **Databases**: Connection management for external databases
- **Queries**: Natural language queries, generated SQL, and execution results
- **Dashboards**: Layout management for data visualization
- **Charts**: Chart configurations and positioning within dashboards

## AI Integration
- **Natural Language Processing**: OpenAI GPT-5 integration for SQL query generation
- **Query Translation**: Converts plain English to SQL with confidence scoring
- **Query Optimization**: SQL validation and performance suggestions

## Storage Strategy
- **Interface-Based Design**: Abstract storage interface allowing for multiple implementations
- **In-Memory Implementation**: Current implementation uses in-memory storage with UUID-based IDs
- **Database Ready**: Architecture supports easy migration to persistent database storage

## Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Hot Reloading**: Full-stack hot reload with error overlay
- **TypeScript**: Strict type checking across the entire application
- **Path Mapping**: Organized imports with @ aliases for clean code structure

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, Wouter for routing
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **Development**: TSX for TypeScript execution, various Vite plugins

## UI and Styling
- **Component Library**: Complete Radix UI suite (40+ components)
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Design System**: Class Variance Authority for component variants
- **Utilities**: clsx for conditional classnames, date-fns for date handling

## Backend Services
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL driver and Zod integration
- **AI Services**: OpenAI API for natural language processing
- **Session Management**: PostgreSQL session store (connect-pg-simple)

## Data Visualization
- **Charting**: Chart.js with React integration (react-chartjs-2)
- **Query Management**: TanStack React Query for efficient data fetching
- **Form Handling**: React Hook Form with Hookform Resolvers

## Development and Quality
- **Type Safety**: Zod for runtime validation and TypeScript integration
- **Code Quality**: ESLint and TypeScript strict mode
- **Replit Specific**: Custom plugins for development environment integration