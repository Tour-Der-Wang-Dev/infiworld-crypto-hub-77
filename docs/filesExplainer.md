
# Project Files Explanation

This document provides an overview of all files in the project, organized by directory, with a brief description of each file's purpose and importance based on imports:

- 🟢 - Core files (many imports/dependencies, essential functionality)
- 💛 - Supporting files (moderate imports/dependencies)
- 🔴 - Utility/auxiliary files (few imports/dependencies)

## Root Files

- `.github/workflows/deploy.yml` 🔴 - GitHub Actions workflow configuration for automated deployment
- `SECURITY.md` 🔴 - Security policy document outlining supported versions and vulnerability reporting
- `README.md` 🟢 - Main project documentation with setup instructions and overview
- `vite.config.ts` 🟢 - Vite configuration for the React application build process

## Source Code (`src`)

### Root Files

- `App.tsx` 🟢 - Main application component defining routes and providers
- `main.tsx` 🟢 - Application entry point that renders the root component
- `App.css` 🔴 - Global application styles

### Components

#### UI Components (`src/components/ui`)
- `accordion.tsx` 🔴 - Collapsible accordion component
- `alert-dialog.tsx` 🔴 - Dialog for important notifications requiring user attention
- `alert.tsx` 🔴 - Alert component for notifications
- `aspect-ratio.tsx` 🔴 - Component for maintaining width/height ratio
- `avatar.tsx` 🔴 - User avatar component
- `badge.tsx` 💛 - Small status indicator component
- `breadcrumb.tsx` 🔴 - Navigation aid showing the user's location
- `button.tsx` 🟢 - Standard button component used throughout the application
- `calendar.tsx` 🔴 - Date selection calendar component
- `card.tsx` 🔴 - Container component with styling for card-like UI elements
- `carousel.tsx` 🔴 - Slideshow component for cycling through elements
- `chart.tsx` 🔴 - Data visualization component
- `checkbox.tsx` 💛 - Input component for binary choices
- `collapsible.tsx` 🔴 - Component that can be collapsed and expanded
- `command.tsx` 🔴 - Command palette interface component
- `context-menu.tsx` 🔴 - Right-click menu component
- `dialog.tsx` 🔴 - Modal dialog component
- `drawer.tsx` 🔴 - Side panel component that slides in from the edge
- `dropdown-menu.tsx` 🔴 - Menu that appears when clicking a trigger element
- `form.tsx` 🔴 - Form component with validation
- `hover-card.tsx` 🔴 - Card that appears when hovering over a trigger
- `image.tsx` 💛 - Enhanced image component with additional features
- `input-otp.tsx` 🔴 - One-time password input component
- `input.tsx` 🟢 - Basic input component used throughout the application
- `label.tsx` 🔴 - Accessible label component for form inputs
- `menubar.tsx` 🔴 - Horizontal menu component
- `navigation-menu.tsx` 🔴 - Navigation component for site structure
- `pagination.tsx` 🔴 - Component for handling pagination
- `popover.tsx` 🔴 - Floating content that appears when clicking a trigger
- `progress.tsx` 🔴 - Progress indicator component
- `radio-group.tsx` 🔴 - Group of radio buttons for selecting one option from many
- `resizable.tsx` 🔴 - Component that can be resized by the user
- `scroll-area.tsx` 🔴 - Scrollable area with custom styling
- `select.tsx` 🔴 - Dropdown selection component
- `separator.tsx` 🔴 - Visual divider between content
- `sheet.tsx` 🔴 - Side panel component similar to a dialog
- `sidebar.tsx` 🔴 - Side navigation component
- `skeleton.tsx` 🔴 - Loading placeholder component
- `slider.tsx` 🔴 - Range input component
- `sonner.tsx` 🔴 - Toast notification integration component
- `switch.tsx` 🔴 - Toggle switch component
- `table.tsx` 🔴 - Data table component
- `tabs.tsx` 💛 - Tabbed interface component
- `textarea.tsx` 🔴 - Multi-line text input component
- `toast.tsx` 🔴 - Temporary notification component
- `toaster.tsx` 🔴 - Container for managing toast notifications
- `toggle-group.tsx` 🔴 - Group of toggle buttons
- `toggle.tsx` 🔴 - Two-state button component
- `tooltip.tsx` 🔴 - Informative popup that appears on hover
- `use-toast.ts` 🔴 - Hook for managing toast notifications

#### Auth Components (`src/components/auth`)
- `RequireAuth.tsx` 🟢 - Authentication wrapper for protected routes
- `UserProfile.tsx` 🟢 - User profile display component

#### Common Components (`src/components/common`)
- `InfiWorldImage.tsx` 🔴 - Brand image component for InfiWorld
- `SEO.tsx` 🟢 - Component for managing SEO metadata

#### Freelance Components (`src/components/freelance`)
- `FreelancerCard.tsx` 🟢 - Card component displaying freelancer information

#### Layout Components (`src/components/layout`)
- `AuthNavbar.tsx` 🟢 - Navigation bar component for authenticated users
- `Footer.tsx` 🟢 - Footer component for all pages
- `Navbar.tsx` 🟢 - Main navigation component

#### Map Components (`src/components/map`)
- `MapComponent.tsx` 🟢 - Main map visualization component
- `StoreDetails.tsx` 🟢 - Component displaying detailed store information
- `StoreFilters.tsx` 🟢 - Filter controls for the map view

#### Marketplace Components (`src/components/marketplace`)
- `FilterSidebar.tsx` 🟢 - Sidebar with filtering options for marketplace listings
- `ListingCard.tsx` 🟢 - Card component displaying marketplace listing information

#### Payment Components (`src/components/payments`)
- `EscrowModal.tsx` 🟢 - Modal for escrow payment functions
- `EscrowReleaseModal.tsx` 🟢 - Modal for releasing escrow funds
- `PaymentConsent.tsx` 🟢 - Component for getting user consent for payment
- `PaymentForm.tsx` 🟢 - Form component for payment details
- `PaymentMethods.tsx` 🟢 - Component displaying available payment methods
- `PaymentModal.tsx` 🟢 - Modal for payment process
- `TransactionCard.tsx` 🟢 - Card displaying transaction information
- `TransactionsList.tsx` 🟢 - List of transaction components

##### Payment Hooks (`src/components/payments/hooks`)
- `usePaymentData.ts` 🟢 - Hook for managing payment data

##### Payment Types (`src/components/payments/types`)
- `types.ts` 🟢 - TypeScript type definitions for payment-related data

#### Home Components (`src/components/home`)
- `ServiceCard.tsx` 🟢 - Component displaying service information on homepage

#### Reservation Components (`src/components/reservations`)
- `ReservationDetails.tsx` 🟢 - Component showing reservation details
- `ReservationForm.tsx` 🟢 - Form for creating/editing reservations
- `ReservationSearchResults.tsx` 🟢 - Results list for reservation searches

### Hooks (`src/hooks`)
- `use-auth.tsx` 🟢 - Authentication hook for user management
- `use-mobile.tsx` 💛 - Hook for detecting mobile device usage
- `use-toast.ts` 💛 - Hook for displaying toast notifications
- `usePayment.ts` 🟢 - Hook for payment functionality
- `usePaymentData.ts` 🟢 - Hook for fetching and managing payment transaction data

#### Tests (`src/hooks/__tests__`)
- `usePaymentData.test.ts` 🔴 - Tests for payment data hook

### Integrations (`src/integrations`)

#### Supabase (`src/integrations/supabase`)
- `client.ts` 🟢 - Supabase client configuration
- `types.ts` 🟢 - TypeScript type definitions for Supabase data

### Lib (`src/lib`)
- `utils.ts` 🟢 - General utility functions used throughout the app

### Pages (`src/pages`)
- `Auth.tsx` 🟢 - Authentication page (login/signup)
- `Freelance.tsx` 🟢 - Freelance services marketplace page
- `Index.tsx` 🟢 - Homepage/landing page
- `Map.tsx` 🟢 - Store location map page
- `Marketplace.tsx` 🟢 - Product marketplace page
- `NotFound.tsx` 💛 - 404 error page
- `Payment.tsx` 🟢 - Payment processing page
- `Profile.tsx` 🟢 - User profile page
- `Reservations.tsx` 🟢 - Reservations management page
- `Transactions.tsx` 🟢 - Transaction history page
- `Verification.tsx` 🟢 - User verification page

### Utils (`src/utils`)
- `payment-utils.ts` 🟢 - Utilities for payment processing
- `security.ts` 💛 - Security-related utilities

#### Tests (`src/utils/__tests__`)
- `payment-utils.test.ts` 🔴 - Tests for payment utilities

### Data (`src/data`)
- `marketplace.ts` 💛 - Marketplace data definitions and mock data
