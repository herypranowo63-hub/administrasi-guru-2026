# SPENSA Digital School Management System

A comprehensive school management application built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of school activities.
- **Academic Management**:
  - **Prota & Promes**: Annual and semester program planning.
  - **TP & ATP**: Learning objectives and flow.
  - **Modul Ajar**: Teaching module repository.
  - **KKTP**: Criteria for learning objective achievement.
  - **Kaldik**: Educational calendar.
- **Student Management**: Student data, attendance, and biodata.
- **Teacher Tools**:
  - **Journal**: Daily teaching journal.
  - **Planning**: Daily lesson planning.
  - **Schedule**: Teaching schedule management.
- **Administration**: User management, data backup/restore.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Data Handling**: XLSX (Excel import/export)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the static files.

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and import your repository.
3. Vercel will automatically detect the Vite settings.
4. Click **Deploy**.

Alternatively, you can install the Vercel CLI and run `vercel deploy`.

### Netlify

1. Drag and drop the `dist` folder to the Netlify Drop area.
2. Or connect your GitHub repository for continuous deployment.

### GitHub Pages

1. Update `vite.config.ts` with `base: '/<repo-name>/'`.
2. Build the project: `npm run build`.
3. Push the `dist` folder to a `gh-pages` branch.

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Application pages
  - `/utils`: Utility functions (e.g., Excel export/import)
  - `/data`: Static data files
  - `App.tsx`: Main application component
  - `constants.ts`: Application constants
  - `types.ts`: TypeScript interfaces
