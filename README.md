# Ship Maintenance Dashboard

A comprehensive ship maintenance management system built for ENTNT Maritime. This application provides a complete solution for managing fleet vessels, their components, and associated maintenance operations.

## 🚀 Live Demo

**Deployed Application**: [https://mellow-mandazi-98f1b9.netlify.app](https://mellow-mandazi-98f1b9.netlify.app)

## 📋 Demo Accounts

- **Admin**: admin@entnt.in / admin123
- **Inspector**: inspector@entnt.in / inspect123
- **Engineer**: engineer@entnt.in / engine123

## ✨ Features

### Core Functionality
- **User Authentication**: Role-based access control with Admin, Inspector, and Engineer roles
- **Ships Management**: Complete CRUD operations for fleet vessels
- **Components Management**: Track and manage ship components with maintenance schedules
- **Maintenance Jobs**: Create, assign, and track maintenance tasks
- **Calendar View**: Visual scheduling and tracking of maintenance activities
- **Notifications**: Real-time in-app notifications for job updates
- **KPI Dashboard**: Comprehensive analytics and metrics visualization

### Technical Features
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Data Persistence**: All data stored locally using localStorage
- **Real-time Updates**: Instant UI updates across all components
- **Form Validation**: Comprehensive validation with user feedback
- **Error Handling**: Graceful error handling throughout the application

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ship-maintenance-dashboard.git
   cd ship-maintenance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Application Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **State Management**: React Context API with useReducer
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Date Handling**: date-fns

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ComponentForm.tsx
│   ├── Header.tsx
│   ├── JobForm.tsx
│   ├── Layout.tsx
│   ├── ShipForm.tsx
│   └── Sidebar.tsx
├── context/            # Global state management
│   └── AppContext.tsx
├── data/              # Mock data and initial state
│   └── mockData.ts
├── pages/             # Main application pages
│   ├── Calendar.tsx
│   ├── Components.tsx
│   ├── Dashboard.tsx
│   ├── Jobs.tsx
│   ├── Login.tsx
│   ├── Notifications.tsx
│   ├── ShipDetails.tsx
│   ├── Ships.tsx
│   └── Users.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

### State Management Architecture
- **Context API**: Centralized state management using React Context
- **Reducer Pattern**: Complex state updates handled through useReducer
- **Local Storage**: Persistent data storage with automatic synchronization
- **Type Safety**: Full TypeScript integration for type-safe state management

### Component Architecture
- **Functional Components**: Modern React with hooks
- **Compound Components**: Complex UI patterns with proper separation of concerns
- **Custom Hooks**: Reusable logic extraction
- **Props Interface**: Strict TypeScript interfaces for all component props

## 🔐 Role-Based Access Control

### Admin
- Full system access
- Manage all ships, components, jobs, and users
- View all analytics and reports

### Inspector
- View all ships and components
- Create and manage maintenance jobs
- Access to calendar and notifications

### Engineer
- View assigned ships and components
- Update maintenance job status
- Manage components for assigned ships

## 📊 Data Model

### Core Entities
- **Users**: Authentication and role management
- **Ships**: Fleet vessel information and status
- **Components**: Ship parts with maintenance schedules
- **Maintenance Jobs**: Work orders and task tracking
- **Notifications**: System alerts and updates

### Relationships
- Ships → Components (One-to-Many)
- Components → Maintenance Jobs (One-to-Many)
- Users → Maintenance Jobs (One-to-Many, as assigned engineer)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter font family, various weights
- **Body**: System font stack for optimal performance
- **Spacing**: 8px grid system

### Components
- **Cards**: Consistent shadow and border radius
- **Forms**: Unified input styling with validation states
- **Buttons**: Multiple variants with hover states
- **Navigation**: Responsive sidebar with active states

## 🚀 Deployment

The application is deployed on Netlify with automatic deployments from the main branch.

### Deployment Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x

## 🐛 Known Issues and Limitations

### Current Limitations
1. **Data Storage**: Uses localStorage only - data is not shared between devices/browsers
2. **File Uploads**: No support for file attachments or document management
3. **Real-time Collaboration**: No multi-user real-time updates
4. **Offline Support**: Limited offline functionality
5. **Data Export**: No built-in export functionality for reports

### Browser Compatibility
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Limited support for Internet Explorer

### Performance Considerations
- Large datasets (1000+ records) may impact performance
- localStorage has size limitations (typically 5-10MB)

## 🔧 Technical Decisions

### Frontend Framework Choice
**React with TypeScript** was chosen for:
- Strong ecosystem and community support
- Excellent TypeScript integration
- Component-based architecture
- Rich development tools

### State Management
**Context API with useReducer** instead of Redux because:
- Simpler setup for medium-complexity applications
- No additional dependencies required
- Built-in React solution
- Sufficient for current requirements

### Styling Solution
**Tailwind CSS** was selected for:
- Rapid development with utility classes
- Consistent design system
- Small bundle size with purging
- Excellent responsive design utilities

### Data Persistence
**localStorage** was chosen to meet requirements:
- No backend infrastructure needed
- Simple implementation
- Meets assignment constraints
- Suitable for demo/prototype applications

### Build Tool
**Vite** was selected over Create React App for:
- Faster development server
- Better build performance
- Modern ES modules support
- Smaller bundle sizes

### Date Handling
**date-fns** instead of moment.js for:
- Smaller bundle size
- Tree-shaking support
- Modern API design
- Better TypeScript support

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication flows
- [ ] CRUD operations for all entities
- [ ] Role-based access restrictions
- [ ] Form validation and error handling
- [ ] Responsive design across devices
- [ ] Data persistence across sessions

### Future Testing Improvements
- Unit tests with Jest and React Testing Library
- Integration tests for complex workflows
- End-to-end tests with Cypress
- Performance testing for large datasets

## 🔮 Future Enhancements

### Planned Features
1. **Data Export**: PDF and Excel export functionality
2. **Advanced Filtering**: More sophisticated search and filter options
3. **Bulk Operations**: Multi-select and bulk actions
4. **File Management**: Document and image upload support
5. **Reporting**: Advanced analytics and custom reports
6. **Mobile App**: React Native mobile application
7. **Real-time Updates**: WebSocket integration for live updates

### Technical Improvements
1. **Backend Integration**: REST API or GraphQL backend
2. **Database**: PostgreSQL or MongoDB integration
3. **Authentication**: JWT-based authentication system
4. **Caching**: Redis caching for improved performance
5. **Testing**: Comprehensive test suite
6. **CI/CD**: Automated testing and deployment pipeline

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact: hr@entnt.in

---

**Built with ❤️ for ENTNT Maritime**