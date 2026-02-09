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

export interface Education {
  institution: string;
  degree: string;
  year?: string;
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export interface RewrittenCV {
  summary: string;
  workHistory: WorkExperience[];
  certifications?: Certification[];
  education?: Education[];
  skills?: string[];
  contactInfo?: ContactInfo;
}
