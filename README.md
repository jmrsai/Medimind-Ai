<p align="center">
  <img src="https://storage.googleapis.com/aif-us-public-images/app-prototyper/apps/medimind/MediMind-AI-Logo-Banner.png" alt="MediMind AI Banner" />
</p>

<h1 align="center">MediMind AI</h1>

MediMind AI is an advanced, AI-powered medical analysis and treatment planning application. It is designed to assist healthcare professionals by providing tools to analyze patient notes, generate comprehensive treatment plans, and summarize lengthy medical documents, streamlining clinical workflows and decision-making.

## Tech Stack

This project is built with a modern, robust technology stack:

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Running Locally

1. **Clone the repository:**
   ```sh
   git clone <your-repository-url>
   cd <repository-folder>
   ```
2. **Install NPM packages:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of your project by copying the example file:
   ```sh
   cp .env.example .env
   ```
   Then, open the `.env` file and fill in your Firebase project configuration and your Gemini API key. You can find your Firebase credentials in your project's settings page in the Firebase console.

4. **Run the development servers:**
   - Start the Next.js app:
     ```sh
     npm run dev
     ```
   - In a separate terminal, start the Genkit development server:
     ```sh
     npm run genkit:watch
     ```
   
5. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI Features

This application uses **Genkit** to power its core AI functionalities. The AI flows are defined in the `src/ai/flows/` directory and include:

- **AI Report Analyzer**: Analyzes patient notes and medical images to provide diagnoses and confidence scores.
- **AI Treatment Planner**: Generates detailed treatment plans based on the analysis.
- **AI Document Summarizer**: Condenses long medical documents into concise summaries.
- **AI Chart Summarizer**: Creates a brief overview from a patient's chart.
- **Medical Vision**: Generates high-quality medical illustrations from text descriptions.
- **Medical Doodle Generator**: Transforms user doodles into detailed medical images.

## Deployment

This application is configured for easy deployment to **Firebase Hosting**.

To deploy the application, you will need the [Firebase CLI](https://firebase.google.com/docs/cli).

1. **Login to Firebase:**
   ```sh
   firebase login
   ```
2. **Initialize Firebase in your project (if you haven't already):**
   ```sh
   firebase init
   ```
3. **Deploy to Firebase Hosting:**
   ```sh
   firebase deploy --only hosting
   ```
