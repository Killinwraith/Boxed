# Boxed Server

A Node.js/Express server for the Boxed cloud storage application with MongoDB integration for folder management.

## Features

- **MongoDB Integration**: Persistent folder storage with hierarchical structure
- **Auth0 Authentication**: JWT-based user authentication
- **Cloudflare R2**: S3-compatible file storage
- **RESTful API**: Complete CRUD operations for folders and files

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas/database)
2. Create a new project
3. Build a free M0 database cluster
4. Create a database user with read/write permissions
5. Add your IP address to the network access list
6. Get your connection string from the "Connect" button

### 2. Environment Variables

Create a `.env` file in the Server directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boxed?retryWrites=true&w=majority

# Auth0 Configuration
AUTH0_AUDIENCE=your-auth0-audience
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com/

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-r2-bucket-name

# Server Configuration
PORT=5001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

## API Endpoints

### Folder Management

#### List Folders

- **GET** `/api/folders`
- **Query Parameters**: `parent` (optional) - parent folder ID
- **Response**: Array of folders for the authenticated user

#### Create Folder

- **POST** `/api/folders`
- **Body**: `{ "name": "Folder Name", "parentFolderId": "optional-parent-id" }`
- **Response**: Created folder object

#### Get Folder Tree

- **GET** `/api/folders/tree`
- **Response**: Hierarchical tree structure of user's folders

#### Get Specific Folder

- **GET** `/api/folders/:id`
- **Response**: Folder object

#### Update Folder

- **PUT** `/api/folders/:id`
- **Body**: `{ "name": "New Folder Name" }`
- **Response**: Updated folder object

#### Delete Folder

- **DELETE** `/api/folders/:id`
- **Response**: Success message

### File Management

#### List Files

- **GET** `/api/files`
- **Query Parameters**: `folderId` (optional) - folder ID
- **Response**: Array of files in the specified folder

#### Upload File

- **POST** `/api/upload`
- **Form Data**: `file` (file), `folderId` (optional)
- **Response**: Upload success message

## MongoDB Schema

### Folder Model

```javascript
{
  name: String (required, max 255 chars),
  parentFolderId: ObjectId (reference to parent folder),
  owner: String (required, user ID),
  path: String (auto-generated hierarchical path),
  createdAt: Date,
  updatedAt: Date
}
```

## Features

- **Hierarchical Folders**: Support for unlimited nesting
- **User Isolation**: Each user only sees their own folders
- **Duplicate Prevention**: Cannot create folders with same name in same parent
- **Path Generation**: Automatic path generation for efficient queries
- **Validation**: Comprehensive input validation and error handling
- **Indexing**: Optimized database indexes for performance

## Error Handling

The API includes comprehensive error handling for:

- Invalid input data
- Duplicate folder names
- Non-existent folders
- Unauthorized access
- Database connection issues

## Development

### Adding New Features

1. Create new models in the `models/` directory
2. Add routes in `server.js`
3. Update this README with new endpoints

### Database Migrations

For production deployments, consider using a migration tool like `migrate-mongo` for schema changes.
