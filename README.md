# ✈️ TripVault

TripVault is a full-stack MERN travel journal application that allows users to securely manage and share their travel memories. Users can register and log in securely, create and manage personal journeys, upload travel photographs, mark favourite trips, and explore journeys shared by other travelers through public profiles.

The application is being developed as part of the **CodGen Virtual Internship Program – Full Stack (MERN)**.

---

## 📌 Project Overview

TripVault is designed as a digital travel journal where users can record their travel experiences and preserve their memories in one place.

The application provides two main experiences:

- **Private Travel Management** – Users can securely create, view, edit, delete, search, and favourite their own journeys.
- **Public Travel Discovery** – Users can discover other travelers, view their public profiles, explore their journeys, and view shared travel photographs.

The project follows a full-stack architecture using React for the frontend, Node.js and Express.js for the backend, MongoDB Atlas for data storage, JWT for authentication, and Cloudinary for cloud-based image storage.

---

# 🚀 Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB Atlas
- Mongoose

## Authentication & Security

- JSON Web Token (JWT)
- bcryptjs
- Authentication middleware
- Protected API routes
- Owner-based authorization

## Cloud & File Uploads

- Cloudinary
- Multer
- multer-storage-cloudinary

---

# ✨ Features

## Week 1 — Authentication & User Management

TripVault initially focused on building a secure authentication system.

Users can:

- Register for an account
- Log in using their email and password
- Receive a JWT token after successful authentication
- Access protected application pages after login
- View their logged-in user information
- Log out securely

The backend uses **bcryptjs** to hash user passwords before storing them in MongoDB. JWT-based authentication is used to protect private routes and APIs.

The authentication system also includes middleware that verifies the user's JWT token before allowing access to protected resources.

---

## Week 2 — Trip Management

Week 2 introduced the core travel journal functionality.

Authenticated users can create and manage their own journeys.

### Trip Creation

Users can create trips by providing information such as:

- Trip title
- Destination
- Start date
- End date
- Rating
- Description

Each trip is associated with the user who created it.

### Trip Management

Users can:

- View all their journeys
- View individual trip details
- Edit existing trips
- Delete trips
- Search trips by title or destination
- Mark trips as favourites
- Filter favourite journeys
- View trip ratings and descriptions

Only the owner of a trip can edit or delete it.

### Dashboard

The dashboard provides a clean interface for accessing the main TripVault features.

It includes:

- My Journeys
- Discover Travelers
- User profile menu
- My Profile navigation
- Logout functionality
- Responsive navigation
- Empty states
- Loading states
- Error handling

---

## Week 3 — Photo Uploads & Public Profiles

Week 3 expanded TripVault from a private travel journal into a platform where travelers can share their journeys and memories.

The main focus of Week 3 was:

- Cloud-based photo storage
- Travel photo uploads
- Public traveler profiles
- Discovering other travelers
- Public journey viewing
- Shared travel memories

---

## ☁️ Photo Uploads with Cloudinary

TripVault uses **Cloudinary** to store travel photographs in the cloud.

Multer is used on the backend to process uploaded image files before they are sent to Cloudinary.

The Trip model supports:

- `coverImage` – stores the main Cloudinary image URL for a trip
- `photos` – stores multiple Cloudinary image URLs for a trip

Users can upload photographs while creating or editing their trips.

### Photo Features

- Upload trip cover images
- Upload multiple travel photographs
- Store image URLs in MongoDB
- Store actual image files in Cloudinary
- Display cover images on trip cards
- Display uploaded photographs on Trip Detail pages
- Display photographs on public journey pages
- Use default destination images when a trip does not have an uploaded cover image
- Preview uploaded images in the trip interface

Cloudinary credentials are stored using environment variables so that sensitive credentials are not hardcoded into the source code.

---

## 🌍 Discover Travelers

TripVault includes a **Discover Travelers** section that allows users to explore other travelers registered on the platform.

Users can:

- View available travelers
- View traveler names
- View traveler bios
- View journey counts
- Open a traveler's public profile
- Explore shared journeys

This provides a social discovery experience within the travel journal application.

---

## 👤 Public User Profiles

TripVault provides public profile pages for travelers.

A public profile contains:

- Traveler name
- Traveler bio
- Number of journeys
- Public journey cards
- Journey destinations
- Journey dates
- Journey ratings
- Journey descriptions
- Trip cover images
- Shared travel photographs

Users can navigate through the following flow:

**Discover Travelers → Public Profile → Journey → Trip Details → Photos**

Public profiles are designed to expose only safe information.

Sensitive information such as passwords, password hashes, and private authentication information is not exposed through the public profile response.

---

## 🧳 My Journeys

The **My Journeys** section displays the logged-in user's own travel memories.

Users can:

- View their journeys
- Search journeys
- Filter favourite journeys
- Create a new journey
- Edit a journey
- Delete a journey
- View complete journey details
- View uploaded photographs
- Add trips to favourites

The Dashboard acts as the main navigation page, while the actual personal journey cards are displayed inside the My Journeys section.

---

## 📸 Trip Details & Photo Gallery

Each trip has an individual detail page.

The Trip Detail page displays:

- Trip title
- Destination
- Start date
- End date
- Rating
- Description
- Cover image
- Uploaded travel photographs

Multiple photographs are displayed in a simple photo gallery/grid.

Public users can also view shared photographs when exploring another traveler's public journey.

---

## ❤️ Favourite Trips

TripVault allows users to save their favourite journeys for quick access.

Users can:

- Add a trip to favourites
- Remove a trip from favourites
- View favourite trips separately
- See the favourite state directly on trip cards

The favourite interface provides visual feedback when a trip is marked as a favourite.

---

# 🎨 Week 4 — UI Enhancement & Deployment

Week 4 focused on improving the overall user interface, enhancing the user experience, and preparing the TripVault application for production deployment.

### UI & User Experience Improvements

The TripVault interface was refined to provide a cleaner, more modern, and user-friendly travel experience.

The improvements include:

- Updated overall application styling
- Improved navigation bar
- Improved dashboard layout
- Enhanced trip cards
- Improved favourite trip interface
- Improved trip creation form
- Improved login and registration pages
- Added footer styling
- Improved spacing, alignment, and visual consistency
- Improved responsive UI
- Improved empty states
- Improved loading and error handling
- Maintained existing application functionality while improving the visual experience

---

## 🧭 Navigation & User Experience

The navigation experience was improved to make the major TripVault sections easier to access.

The application provides navigation for:

- Dashboard
- My Journeys
- Discover Travelers
- My Profile
- Create Trip
- Logout

Protected pages continue to require authentication.

---

## 📱 Responsive Interface

The UI was refined to provide a consistent experience across different screen sizes.

The styling focuses on:

- Responsive layouts
- Flexible trip cards
- Mobile-friendly navigation
- Proper spacing and alignment
- Readable forms
- Consistent buttons and controls

---

## ☁️ Production Deployment

The final stage of Week 4 includes preparing TripVault for production deployment.

### Backend Deployment

The Node.js and Express.js backend is deployed as a Web Service using **Render**.

The backend deployment includes:

- Node.js backend
- Express REST APIs
- MongoDB Atlas connection
- JWT authentication
- Cloudinary image uploads
- Environment variables for sensitive credentials

### Frontend Deployment

The React/Vite frontend is deployed using **Vercel**.

The frontend communicates with the deployed backend through the configured API URL.

The production architecture is:

```text
                    TripVault
                       │
              ┌────────┴────────┐
              │                 │
          Frontend           Backend
           Vercel             Render
              │                 │
              │          ┌──────┴──────┐
              │          │             │
              │      MongoDB Atlas  Cloudinary
              │
              └──── API Requests ────┘