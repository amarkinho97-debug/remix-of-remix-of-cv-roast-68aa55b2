export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Certification {
  name: string;
  institution: string;
  year?: string;
}

export interface RewrittenCV {
  summary: string;
  workHistory: WorkExperience[];
  certifications?: Certification[];
}
