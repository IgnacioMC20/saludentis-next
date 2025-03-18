# Technical Context: Saludentis

## Technologies Used

### Frontend
- **Next.js (v14.2.4)**: React framework for server-rendered applications
- **React (v18)**: UI library for component-based development
- **TypeScript (v5)**: Typed JavaScript for improved developer experience and code quality
- **Material UI (v5.15+)**: Component library implementing Google's Material Design
- **Emotion**: CSS-in-JS library used with Material UI
- **React Hook Form (v7.52)**: Form handling library
- **React Toastify (v10.0)**: Toast notification library
- **TanStack React Query (v5.55)**: Data fetching and state management library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Mongoose (v8.5)**: MongoDB object modeling tool
- **NextAuth (v4.23)**: Authentication library for Next.js
- **JSON Web Token (v9.0)**: JWT implementation for secure authentication
- **bcryptjs (v2.4)**: Password hashing library

### Testing
- **Jest (v29.7)**: JavaScript testing framework
- **React Testing Library (v16.0)**: Testing utilities for React components
- **User Event (v14.5)**: Simulating user events in tests

### Development Tools
- **ESLint (v8)**: JavaScript/TypeScript linter
- **Prettier**: Code formatter
- **Husky (v9.0)**: Git hooks for code quality checks
- **Commitlint (v19.3)**: Lint commit messages

## Development Setup

### Prerequisites
- Node.js (LTS version recommended)
- Yarn package manager
- MongoDB instance (local or remote)

### Environment Configuration
The application uses environment variables for configuration, with a template provided in `.env.template`:

```
# Database connection
MONGODB_URI=

# NextAuth configuration
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# JWT Secret
JWT_SECRET=
```

### Development Workflow
1. **Installation**: `yarn install`
2. **Development Server**: `yarn dev`
3. **Linting**: `yarn lint` or `yarn lint:fix`
4. **Testing**: `yarn test` or `yarn test:watch` or `yarn test:cov`
5. **Building**: `yarn build`
6. **Production Server**: `yarn start`

### Docker Support
The project includes Docker configuration for containerized deployment:
- `docker-compose.yaml` for orchestrating services
- `init.sh` script for initialization

## Technical Constraints

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No explicit support for legacy browsers

### Performance Considerations
- Server-side rendering for improved initial load performance
- Client-side navigation for responsive user experience
- Optimized data fetching with React Query

### Security Requirements
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

### Scalability Approach
- Stateless architecture for horizontal scaling
- Database indexing for query performance
- Optimistic UI updates for perceived performance

## Dependencies

### Core Dependencies
```json
{
  "@emotion/react": "^11.11.4",
  "@emotion/styled": "^11.11.5",
  "@fontsource/roboto": "^5.0.13",
  "@mui/icons-material": "^5.16.0",
  "@mui/material": "^5.15.21",
  "@mui/x-charts": "^7.9.0",
  "@tanstack/react-query": "^5.55.0",
  "@tanstack/react-query-devtools": "^5.55.0",
  "bcryptjs": "^2.4.3",
  "js-cookie": "^3.0.5",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.5.0",
  "next": "14.2.4",
  "next-auth": "^4.23.2",
  "react": "^18",
  "react-dom": "^18",
  "react-hook-form": "^7.52.1",
  "react-toastify": "^10.0.5"
}
```

### Development Dependencies
```json
{
  "@commitlint/cli": "^19.3.0",
  "@commitlint/config-conventional": "^19.2.2",
  "@tanstack/eslint-plugin-query": "^5.53.0",
  "@testing-library/dom": "^10.3.0",
  "@testing-library/jest-dom": "^6.4.6",
  "@testing-library/react": "^16.0.0",
  "@testing-library/user-event": "^14.5.2",
  "@types/bcryptjs": "^2.4.6",
  "@types/jest": "^29.5.12",
  "@types/js-cookie": "^3.0.6",
  "@types/jsonwebtoken": "^9.0.6",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "@typescript-eslint/eslint-plugin": "^6.7.4",
  "@typescript-eslint/parser": "^6.7.4",
  "babel-jest": "^29.7.0",
  "eslint": "^8",
  "eslint-config-next": "14.2.4",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-import": "^2.28.1",
  "eslint-plugin-prettier": "^5.1.3",
  "eslint-plugin-react": "^7.33.2",
  "husky": "^9.0.11",
  "identity-obj-proxy": "^3.0.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "ts-node": "^10.9.2",
  "typescript": "^5"
}
```

## Technical Evolution

### Recent Updates
- Upgraded to Next.js 14.2.4
- Implemented React Query for improved data fetching
- Enhanced testing coverage with Jest and React Testing Library
- Added chart visualization capabilities with MUI X Charts

### Planned Technical Improvements
- Consider migration to App Router from Pages Router
- Evaluate server components for improved performance
- Enhance error handling and logging
- Implement more comprehensive end-to-end testing
