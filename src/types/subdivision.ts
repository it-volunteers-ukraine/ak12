import { Locale } from "./locale";

export interface Subdivision {
  id: string; 
  name: string;
  slug: string | null;
  description: string;
  siteUrl: string | null;  
  imageUrl: string;        
  isActive: boolean;       
  sortOrder: number;       
  languageCode: Locale;    
  languageId: string;      
}