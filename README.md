# PetAdopt 🐾

PetAdopt is a modern, high-performance, full-stack web application designed to bridge the gap between animal shelters and prospective pet adopters. The platform features role-based portal experiences for Administrators, Shelters, and Adopters, and integrates real-time notifications to facilitate quick communication and approval workflows.

---

## 🚀 Key Features

### 👤 User Portals & Roles
- **Adopter Portal**:
  - Browse available pets with powerful search and dynamic filters (breed, age, type, size).
  - Manage a personal **Favorites** list for quick access to pets.
  - Submit formal **Adoption Requests** to shelters.
  - Write and submit **Shelter Reviews** and feedback after successful adoptions.
  - View real-time request statuses.
- **Shelter Portal**:
  - Dedicated dashboard to list and manage pets (Create, Read, Update, Delete).
  - Upload multiple high-quality pet photos (integrated with **Cloudinary** / local static file serving).
  - Manage incoming **Adoption Requests** (Approve, Reject, Pending status).
  - Receive instant **Real-Time Notifications** when new requests are submitted.
- **Administrator Portal**:
  - System-wide administration dashboard.
  - Monitor registration requests and manage **User Verification** (Shelter/Adopter approval gates).
  - Manage users, view statistics, and ensure platform safety.

### ⚡ Technical Features
- **Real-Time Notifications**: Integrated with ASP.NET Core **SignalR** to push alerts for new adoption requests or status updates instantly.
- **Security & Authorization**: Secure, stateless session management using **JWT (JSON Web Tokens)**. Role-based access control (RBAC) handles route protection on both client and server.
- **Pending-State Gates**: New Shelter accounts must be manually reviewed and approved by an Admin before accessing internal shelter tools.
- **Form Validation**: End-to-end form state management and schema validation utilizing **React Hook Form** and **Zod** on the frontend.
- **State Management & Data Synchronization**: Client state powered by **Zustand**; server state caching and synchronization handled by **TanStack React Query**.

---

## 🛠️ Tech Stack & Architecture

### Backend (.NET 8 Web API)
The backend is structured using a clean, layered architecture:
- **Presentation Layer (`PetAdopt.Presentation`)**: Handles HTTP requests, CORS policies, SignalR hubs, and contains REST controllers.
- **Business Logic Layer (`PetAdopt.BusinessLogic`)**: Contains core application services, DTO mappings, authorization checks, and logic helpers.
- **Data Access Layer (`PetAdopt.DataAccess`)**: Interacts with the database using **Entity Framework Core (EF Core)** and implements the **Repository Pattern** for cleaner database abstractions.
- **Database**: **Microsoft SQL Server**.

### Frontend (React 19 + TypeScript)
A sleek, responsive, and interactive Single Page Application (SPA):
- **Core Framework**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 (responsive utility classes, modern layout components)
- **State Management**: Zustand (local/global authentication and UI state)
- **Data Fetching**: TanStack React Query (caching, optimistic updates, and background synchronization) & Axios (base API client)
- **Routing**: React Router DOM (v7) with role-protected route guards
- **Icons & UI Feedback**: Lucide React icons, React Hot Toast alerts

---

## 📂 Project Directory Structure

```text
PetAdopt/
├── PetAdopt.sln                         # Visual Studio Solution File
├── PetAdopt.Presentation/               # Backend Web API (Controllers, Program.cs, config)
├── PetAdopt.BusinessLogic/              # Services, Hubs, DTOs, Helpers
├── PetAdopt.DataAccess/                 # EF Core DBContext, Entities (Models), Repositories, Migrations
└── petadopt-frontend/                  # React Frontend Application (Vite project)
    ├── public/                          # Static assets
    └── src/
        ├── assets/                      # Styles & media files
        ├── components/                  # Shared UI components (Modals, Navbars, Cards)
        ├── pages/                       # Portal pages grouped by role (admin, adopter, auth, shelter, pets)
        ├── services/                    # Axios API client, SignalR connection service, API modules
        ├── store/                       # Zustand auth & user stores
        └── utils/                       # Common utilities & validation schemas
```

---

## 💾 Database Schema

The relational database (`PetAdoptDB`) runs on MS SQL Server with the following main entities:
- **Users**: Represents admins, approved/pending shelters, and adopters.
- **Pets**: General characteristics of the pets (Breed, Type, Age, Size, Description, Status, Shelter ID).
- **PetImages**: Maps multiple photos to each pet listing.
- **AdoptionRequests**: Connects Adopters and Pets, tracking request status (Pending, Approved, Rejected).
- **Favorites**: Many-to-many relationship mapping Adopters to their bookmarked Pets.
- **Reviews**: Stores ratings and written reviews from Adopters for specific Shelters.
- **Notifications**: Stores alerts for users that are delivered live via SignalR and fetched on login.

---

## ⚙️ Setup & Installation

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18 or higher)](https://nodejs.org/) & `npm`
- [Microsoft SQL Server](https://www.microsoft.com/sql-server/) (or LocalDB)

---

### 1. Backend Setup

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd PetAdopt
   ```

2. **Configure Database Connection & App Settings**:
   Open `PetAdopt.Presentation/appsettings.json` and adjust the connection string to match your SQL Server instance:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=PetAdoptDB;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```
   *(Optional: If you wish to use Cloudinary for pet picture uploads, populate the Cloudinary section in `appsettings.json` with your credentials).*

3. **Run Database Migrations**:
   Generate the database and apply the initial migrations:
   ```bash
   dotnet ef database update --project PetAdopt.DataAccess --startup-project PetAdopt.Presentation
   ```
   *(Alternatively, run it from Package Manager Console in Visual Studio).*

4. **Start the Web API**:
   ```bash
   dotnet run --project PetAdopt.Presentation
   ```
   By default, the backend API runs on `http://localhost:5247`. You can explore the interactive API documentation at `http://localhost:5247/swagger`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd petadopt-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `petadopt-frontend` root directory if you want to override the default backend URL:
   ```env
   VITE_API_URL=http://localhost:5247/api
   ```
   *(If not provided, the frontend falls back to `http://localhost:5247/api`).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The React application will be hosted on `http://localhost:5173`. Open this URL in your web browser.

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
