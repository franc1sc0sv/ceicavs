export type ToolColor =
  | "lime"
  | "amber"
  | "red"
  | "sky"
  | "rose"
  | "violet"
  | "emerald"
  | "orange"
  | "stone"
  | "cyan"
  | "yellow"
  | "indigo"
  | "teal"
  | "fuchsia";

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  icon: string;
  color: ToolColor;
}

export interface Favorite {
  userId: string;
  toolId: string;
}

export interface TeachingToolsProps {
  tools: Tool[];
  categories: ToolCategory[];
  favorites: Favorite[];

  /** Called when the user selects a tool card to open it full-page */
  onSelectTool?: (toolId: string) => void;
  /** Called when the user navigates back from a tool to the grid via breadcrumb */
  onBackToGrid?: () => void;
  /** Called when the user toggles a tool as favorite */
  onToggleFavorite?: (toolId: string) => void;
  /** Called when the user searches/filters tools by name */
  onSearch?: (query: string) => void;
}
