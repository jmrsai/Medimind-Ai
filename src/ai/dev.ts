import { config } from 'dotenv';
config();

import '@/ai/flows/generate-treatment-plan.ts';
import '@/ai/flows/analyze-patient-notes.ts';
import '@/ai/flows/summarize-medical-document.ts';
import '@/ai/flows/summarize-patient-chart.ts';
import '@/ai/flows/generate-medical-illustration.ts';
