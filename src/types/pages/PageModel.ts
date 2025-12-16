export interface PageModel {
  _id?: string;
  id?: string;
  slug?: string;
  title?: string;
  content?: string;
  status?: string;
  tenantId: string; 
  websiteId: string;
  createdAt?: string;
  updatedAt?: string;
}
