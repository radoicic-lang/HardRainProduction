/**
 * Shared Type Definitions for Cinematic Portfolio and Client Portal
 */

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: "Commercial" | "Narrative" | "Music Video" | "Documentary" | "Branded Content" | string;
  aspectRatio: "2.39:1" | "16:9" | "9:16" | "1:1" | string;
  videoDuration: string;
  role: "Producer" | "Executive Producer" | "Director" | "Director of Photography" | string;
  thumbnailUrl: string;
  director: string;
  cinematographer: string;
  budgetGrade: "Tier-1 (Premium)" | "Tier-2 (Mid-Range)" | "Tier-3 (Indie/Agile)" | string;
  cameraPackage: string;
  lensesUsed: string;
  colorSpace: string;
  releaseYear: string;
  synopsis: string;
  projectStory?: string;
  technicalCraftDetails?: string;
  resultImpact?: string;
  moodTags?: string[];
  vimeoVideoId?: string;
}

export interface ReviewComment {
  id: string;
  timestamp: string; // real calendar datetime string
  timecode: string; // "00:15.08"
  timeInSeconds: number;
  user: string;
  avatarColor: string;
  text: string;
  isResolved?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
  description: string;
  dueDate: string;
  completedAt?: string;
}

export interface ActiveProject {
  id: string;
  name: string;
  clientName: string;
  status: "Creative & Scripting" | "Pre-Production" | "Principal Photography" | "Post-Production" | "Client Review" | "Final Delivery";
  completionPercentage: number;
  thumbnailUrl: string;
  nextShootDate?: string;
  budgetSpentPercentage: number;
  budgetTotal: string;
  director: string;
  timeline: Milestone[];
  reviewComments: ReviewComment[];
  videoStreamUrl: string; // mock cinematic streaming target
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ServiceDetail {
  name: string;
  description: string;
  pricingEstimate: string;
  equipmentStandard: string;
  deliveryTime: string;
}

export interface AgentManifest {
  companyName: string;
  producerName: string;
  specialties: string[];
  operationalRegions: string[];
  contactEmail: string;
  contactPhone?: string;
  vimeoUrl?: string;
  cameraPackages: string[];
  postProductionCapabilities: string[];
  faqs: FAQItem[];
  services: ServiceDetail[];
}
