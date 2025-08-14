# Document Management System (DMS)

A modern, responsive Document Management System built with ReactJS and Tailwind CSS, featuring role-based access control and user management capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - Secure login/logout system
  - Password reset functionality
  - Role-based access control

- **User Management (Admin)**
  - Create, edit, and manage user accounts
  - Assign roles and permissions
  - User status management (active/inactive)
  - Password reset for users

- **Role Management (Admin)**
  - Create and manage user roles
  - Granular permission system
  - Role assignment and editing

- **Document Management**
  - Upload, view, download, and manage documents
  - Drag & drop file upload with progress tracking and visual feedback
  - Support for multiple file types (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, images, text)
  - Document metadata and custom fields
  - Version control and revision tracking
  - Document status management (check-in/check-out, approval workflows)
  - Advanced search with real-time results
  - Multi-criteria filtering (type, status, folder, tags)
  - Folder navigation with tree-view structure
  - Document tagging system with visual badges
  - Favorite documents with toggle functionality
  - Tab-based views (All/Recent/Favorites)
  - Bulk document operations and selection
  - Document preview modal with detailed metadata

- **Workflow & Collaboration**
  - Multi-step document approval workflow
  - Comments system with internal/external visibility
  - Approval history with progress tracking
  - Document status tracking (draft, pending, approved, rejected)
  - Role-based approval permissions
  - Collaborative document review process

- **Notifications & Monitoring**
  - Real-time notification system
  - Priority-based notification levels (low, medium, high)
  - Notification dropdown with unread indicators
  - Document approval requests and status updates
  - Comment notifications and deadline reminders
  - System alerts and maintenance notifications

- **Audit & Compliance**
  - Comprehensive audit trail logging
  - User activity tracking and monitoring
  - Advanced filtering for audit logs (date, user, action, severity)
  - Document access and modification history
  - Compliance reporting and security monitoring
  - IP address and user agent tracking

- **Dashboard**
  - System overview and statistics
  - Quick access to admin functions and document management
  - Recent activity monitoring

### Technical Features
- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light theme support
  - Tailwind CSS for styling
  - Component-based architecture

- **State Management**
  - React Context for global state
  - Toast notifications system
  - Form validation and error handling

- **Accessibility**
  - ARIA labels and semantic HTML
  - Keyboard navigation support
  - Screen reader friendly

## 🛠️ Tech Stack

- **Frontend Framework**: ReactJS 18+
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React Context + Hooks
- **Routing**: React Router
- **Type Safety**: TypeScript
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── form/           # Form components
│   ├── header/         # Header components
│   ├── ui/             # Base UI components
│   └── admin/          # Admin-specific components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layout/             # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── AuthPages/      # Authentication pages
│   └── Dashboard/      # Dashboard pages
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd document-management
```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

### Admin Access
- **Email**: `admin@dms.com`
- **Password**: `admin123`

### User Access
- **Email**: `user@dms.com`
- **Password**: `user123`

## 📱 Available Routes

### Public Routes
- `/signin` - User login
- `/signup` - User registration
- `/reset-password` - Password reset

### Protected Routes (Requires Authentication)
- `/` - Dashboard home
- `/profile` - User profile

### Admin Routes (Requires Admin Role)
- `/admin/roles` - Role management
- `/admin/users` - User management

### Other Routes
- `/calendar` - Calendar view
- `/form-elements` - Form examples
- `/basic-tables` - Table examples
- `/alerts`, `/avatars`, `/badges`, `/buttons` - UI component examples

## 🎨 Component Library

### Core Components
- **Button** - Primary, outline, and icon variants
- **Input** - Text, email, password inputs with validation
- **Select** - Dropdown selection component
- **Checkbox** - Checkbox with label support
- **Modal** - Responsive modal dialogs
- **Table** - Data table with sorting and pagination
- **Alert** - Success, error, warning, and info alerts
- **Toast** - Notification system

### Layout Components
- **AppLayout** - Main application layout
- **AppHeader** - Top navigation header
- **AppSidebar** - Left navigation sidebar
- **ComponentCard** - Content wrapper with title and description

## 🔧 Development

### Adding New Components
1. Create component file in appropriate directory
2. Follow naming convention: `PascalCase.tsx`
3. Export as default export
4. Add TypeScript interfaces for props
5. Use Tailwind CSS classes for styling

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation if needed
4. Follow existing page structure

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing and typography
- Support both light and dark themes

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 📦 Building for Production

### Build Command
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 4.0.0 (Current) - Enhanced User Experience & Organization
- **NEW**: Advanced search and filtering system
- **NEW**: Folder navigation with tree-view structure
- **NEW**: Document organization with tags and badges
- **NEW**: Tab-based document views (All/Recent/Favorites)
- **NEW**: Favorite documents system with toggle functionality
- **NEW**: Document preview modal with metadata display
- **NEW**: Drag & drop upload area with visual feedback
- **NEW**: Bulk document operations and selection
- **NEW**: Real-time search with instant results
- **NEW**: Advanced filtering by document type and status
- **NEW**: Responsive sidebar with folder management
- **IMPROVED**: Enhanced document table with tags display
- **IMPROVED**: Better upload modal with tag support
- **IMPROVED**: Modern dashboard layout matching mockup design

### Version 3.0.0 - Advanced Features & Workflow
- **NEW**: Document approval workflow system
- **NEW**: Comments and collaboration features
- **NEW**: Real-time notification system
- **NEW**: Comprehensive audit trail and activity logging
- **NEW**: Document detail pages with tabbed interface
- **NEW**: Approval history with progress tracking
- **NEW**: Internal/external comment system
- **NEW**: Advanced filtering and search for audit logs
- **NEW**: Notification dropdown with priority levels
- **IMPROVED**: Enhanced document management with workflow states
- **IMPROVED**: Admin dashboard with audit log access
- **IMPROVED**: Centralized mock data with workflow information

### Version 2.0.0 - Document Management
- **NEW**: Complete document management system
- **NEW**: File upload with drag & drop support
- **NEW**: Document versioning and revision control
- **NEW**: Folder navigation and organization
- **NEW**: Document search and filtering
- **NEW**: Favorites and bulk operations
- **NEW**: Advanced upload modal with metadata
- **NEW**: Document status workflows
- **NEW**: File type icons and previews
- **IMPROVED**: Enhanced dashboard with document quick access
- **IMPROVED**: Centralized mock data structure

### Version 1.0.0 - Foundation
- Initial release
- User authentication system
- Role-based access control
- Admin user and role management
- Responsive dashboard
- Toast notification system
- Dark/light theme support

## 🚀 Deployment

### Cloudflare Pages (Recommended)

This project is optimized for deployment on Cloudflare Pages with automatic Git integration.

#### Option 1: Automatic Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Cloudflare Pages
3. Use these build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`

#### Option 2: Manual Deployment
```bash
# Login to Cloudflare
npm run cf:login

# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Other Platforms
The built application in the `dist` folder can be deployed to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront

---

**Built with ❤️ using ReactJS and Tailwind CSS**
