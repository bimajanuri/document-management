# Mock Data Structure Documentation

## 📁 Overview

This folder contains all the mock data used throughout the Document Management System application. All data is centralized here for easy maintenance and consistency across components.

## 🗂️ File Structure

```
src/data/
├── index.ts           # Main export file with utility functions
├── mockData.ts        # All mock data definitions
└── README.md          # This documentation file
```

## 📊 Data Types

### User Management
- **User**: User account information
- **Role**: User roles and permissions
- **Permission**: Individual system permissions
- **RoleOption**: Role options for form dropdowns

### Dashboard
- **DashboardStats**: System statistics
- **ActivityItem**: Recent system activities
- **QuickAction**: Quick action buttons
- **DocumentCategory**: Document categories
- **SystemStatus**: System service status

## 🔧 Usage Examples

### Basic Import
```typescript
import { mockUsers, mockRoles } from '../../data';
```

### Using Utility Functions
```typescript
import { getUserById, getUsersByRole } from '../../data';

const user = getUserById('1');
const adminUsers = getUsersByRole('admin');
```

### Importing Types
```typescript
import { type User, type Role } from '../../data';

const users: User[] = mockUsers;
```

## 📝 Adding New Data

### 1. Define Interface
```typescript
export interface NewDataType {
  id: string;
  name: string;
  // ... other properties
}
```

### 2. Create Mock Data
```typescript
export const mockNewData: NewDataType[] = [
  {
    id: "1",
    name: "Example",
    // ... other properties
  }
];
```

### 3. Add to Default Export
```typescript
export default {
  // ... existing exports
  newData: mockNewData
};
```

### 4. Add to Index File
```typescript
export {
  // ... existing exports
  mockNewData,
  type NewDataType
} from './mockData';
```

## 🎯 Best Practices

1. **Single Source of Truth**: All mock data should be defined here
2. **Type Safety**: Always define TypeScript interfaces
3. **Consistent Naming**: Use `mock` prefix for data arrays
4. **Documentation**: Add JSDoc comments for complex data structures
5. **Validation**: Ensure data consistency across components

## 🔄 Data Updates

When updating mock data:

1. Modify the data in `mockData.ts`
2. Update related interfaces if needed
3. Test components that use the data
4. Update this documentation if structure changes

## 📋 Current Data Sets

- **Users**: 5 sample users with different roles
- **Roles**: 4 role types with permissions
- **Permissions**: 7 system permissions in 3 categories
- **Dashboard Stats**: System overview metrics
- **Recent Activity**: 5 sample activity items
- **Quick Actions**: 6 common system actions
- **Document Categories**: 5 document types
- **System Status**: 5 service status indicators

## 🚀 Future Enhancements

- [ ] Add more realistic sample data
- [ ] Implement data seeding functions
- [ ] Add data validation utilities
- [ ] Create data migration scripts
