// Tiptap JSON structure types
export interface TiptapNodeContent {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNodeContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
  }[];
  text?: string;
}

export interface TiptapContent {
  type: string;
  content: TiptapNodeContent[];
}

export interface StoryEntry {
  _id: string;
  image: string; // S3 image URL
  content: TiptapContent;
  createdAt: string;
  updatedAt: string;
}
