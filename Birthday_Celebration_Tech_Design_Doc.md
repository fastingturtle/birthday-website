
# Technical Design Document for Birthday Celebration Website

---

## 1. Project Overview

The Birthday Celebration Website aims to provide an interactive, personalized platform to celebrate a friend's birthday. 
Users can engage with memes, participate in interactive flows, upload pictures/videos, and generate celebratory content 
such as videos or digital birthday cards.

---

## 2. Goals

- **Engaging UI/UX:** Animations, vibrant designs, and an intuitive interface.
- **Interactive Content:** Options for user-uploaded content and dynamic outputs.
- **Seamless Hosting:** Fast and reliable performance using modern hosting solutions.

---

## 3. Tech Stack

### Frontend

- **Framework:** Next.js (React-based, SSR and SSG support).
- **Styling:** Tailwind CSS for efficient and responsive design.
- **Animations:** Framer Motion for smooth interactions and dynamic animations.
- **File Handling:** React Hook Form for form management.

### Backend

- **Hosting:** Vercel for deployment, CDN, and serverless function support.
- **File Storage:** Cloudinary for handling media uploads, transformations, and storage.

### Database

- **Option 1:** Firebase Firestore (realtime, scalable NoSQL).
- **Option 2:** Supabase (PostgreSQL-based).

### Dynamic Content Generation

- **Video Generation:** FFmpeg (locally or via serverless tools).
- **Card Generation:** Libraries like html-to-image, html-pdf-node, or Puppeteer.

---

## 4. Features Breakdown

### Landing Page

- **Greeting Section:**
  - Animated "Happy Birthday, [Name]!" greeting.
  - Collection of birthday memes displayed in a carousel/grid.

- **Interactive Buttons:**
  - **"Click me for a surprise":** Triggers fireworks/confetti with celebratory text.
  - **"Have you congratulated [Name]?":** Yes/No flow:
    - **Yes:** Leads to a congratulatory page.
    - **No:** Leads to a playful mocking page.

### Photo/Video Upload

- **Frontend:**
  - Drag-and-drop uploader with fallback "Upload" button.
  - Preview area for images and videos.
  - File size restrictions (e.g., max 10MB).

- **Backend:**
  - Files uploaded to Cloudinary.
  - Metadata (uploader name, captions, file URLs) stored in Firebase/Supabase.

### Video Generation

- **Process:**
  - Users select uploaded files and click "Generate Video."
  - Backend uses FFmpeg (or a third-party API) to stitch files into a video.
  - Video is stored in Cloudinary and a link is provided for sharing or downloading.

### Birthday Card Generation

- **Frontend:**
  - Predefined templates with options for fonts, colors, stickers, and backgrounds.
  - Drag-and-drop zones for uploaded images and text.
  - Real-time preview of the card.

- **Backend:**
  - Converts designs to downloadable PDFs/images using Puppeteer, html-to-image, or html-pdf-node.
  - Generated cards stored in Cloudinary.

---

## 5. System Architecture

### Frontend

- **Routing:** Next.js for page-based routing.
- **State Management:** Local state or context API for temporary storage.
- **Animations:** Framer Motion for transitions and effects.

### Backend

- **API:** Vercel serverless functions for Cloudinary integration and dynamic content workflows.

---

## 6. Component Structure

| Component            | Description                                         |
|-----------------------|-----------------------------------------------------|
| `LandingPage`        | Displays the main greeting, memes, and buttons.     |
| `SurpriseAnimation`  | Fireworks/confetti animations with celebratory text.|
| `QuestionPage`       | Handles the "Yes/No" branching logic and navigation.|
| `UploadSection`      | Manages file uploads and previews.                  |
| `VideoGenerator`     | Handles video selection and generation workflow.    |
| `CardDesigner`       | Provides drag-and-drop UI for birthday card creation.|
| `CongratulatoryPage` | Positive memes with a cheerful message.             |
| `MockingPage`        | Playful memes with humorous, animated text.         |

---

## 7. API Endpoints

| Endpoint             | Method | Description                                |
|----------------------|--------|--------------------------------------------|
| `/api/upload`        | POST   | Handles media uploads to Cloudinary.      |
| `/api/generate-video`| POST   | Processes video creation using selected files.|
| `/api/generate-card` | POST   | Converts card designs to downloadable files.|

---

## 8. Milestones

### Week 1: Setup and Landing Page

- Initialize Next.js project.
- Configure Tailwind CSS and Framer Motion.
- Build landing page with greeting, animations, and basic navigation.

### Week 2: Upload Section and Cloudinary Integration

- Create file upload UI.
- Set up Cloudinary API for uploads.
- Integrate metadata storage with Firebase/Supabase.

### Week 3: Question Flow and Generators

- Implement "Yes/No" branching logic and corresponding pages.
- Develop video generator and integrate FFmpeg or third-party APIs.
- Build basic card designer interface.

### Week 4: Final Polishing and Deployment

- Add animations and finalize designs.
- Test functionality on mobile and desktop.
- Deploy to Vercel and share with users.

---

