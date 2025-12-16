
// Make BlocksModel compatible with BlockConfig
export interface BlocksModel {
  id: string;
  label: string;
  category?: string;
  content: string | Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export type BlocksByCategory = Record<string, BlocksModel[]>;