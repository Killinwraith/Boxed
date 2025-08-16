# Boxed Client

A React-based frontend for the Boxed cloud storage application with MongoDB-powered folder management.

## Features

- **Modern UI**: Clean, responsive interface built with React and TypeScript
- **Folder Management**: Create, navigate, and delete folders with hierarchical structure
- **File Operations**: Upload, download, and manage files
- **Authentication**: Secure login with Auth0
- **Real-time Updates**: Automatic refresh of folder and file lists
- **Breadcrumb Navigation**: Easy navigation through folder hierarchy

## Setup Instructions

### 1. Environment Variables

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Update `.env` with your actual values:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

The client communicates with the server through the following endpoints:

### Folder Management

- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `GET /api/folders/tree` - Get folder hierarchy
- `GET /api/folders/:id` - Get specific folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

### File Management

- `GET /api/files` - List files
- `POST /api/upload` - Upload file
- `GET /api/files/:fileName` - Download file
- `DELETE /api/files/:fileName` - Delete file

## Component Structure

- **Dashboard**: Main file management interface
- **API Client**: Centralized API communication
- **Shared Models**: TypeScript interfaces for data structures

## Features

### Folder Operations

- Create new folders with validation
- Navigate through folder hierarchy
- Delete folders (with confirmation)
- Breadcrumb navigation
- Empty state handling

### File Operations

- Upload multiple files
- View file details (name, size)
- Download files
- Delete files

### User Experience

- Loading states
- Error handling
- Responsive design
- Keyboard shortcuts (Enter to create folder)

## Development

### Adding New Features

1. Update API client in `api/api.tsx`
2. Add new components as needed
3. Update TypeScript models in `Shared/Models/`
4. Test with the running server

### Styling

- Uses CSS modules for component-specific styling
- Responsive design with flexbox
- Consistent color scheme and spacing

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Check `VITE_API_URL` in `.env`
2. **Authentication Errors**: Verify Auth0 configuration
3. **CORS Issues**: Ensure server is running and CORS is configured

### Development Tips

- Use browser dev tools to inspect API calls
- Check console for error messages
- Verify environment variables are loaded correctly
