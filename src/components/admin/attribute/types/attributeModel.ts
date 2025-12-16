import { MaterialCategory } from "../../category/types/CategoryModel";


type Data_Type = "enum" | "number" | "text";
export interface MaterialAttributes {
  id?: number;
  name?: string;
  data_type?: Data_Type;
  unit?: string;
  possible_values?: (string | number)[] | null;
  type?: string;
  category_id?: number | null | MaterialCategory | undefined;
}
