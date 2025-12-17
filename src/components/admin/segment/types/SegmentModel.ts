import { ObjectId } from "mongodb";

export interface MaterialSegmentModel {
  id?: number | null;
  name?: string;
  color?: string;
  color_code?: string;
  icon?: string;
  icon_svg?: string;
  index?: number;
  is_active?: boolean;
  is_visible?: boolean;
  description?: string;
  short_code?: string;
  categories?: string;
  gallery?: string;
  websiteId?: string | ObjectId;
  tenantId?: string | ObjectId;
}
