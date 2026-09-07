export interface EmptyTableDataItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionButton?: {
    label: string;
    location?: string;
  };
}

export const EMPTY_TABLE_DATA: EmptyTableDataItem[] = [
  {
    id: "blogs",
    title: "No Blog Articles",
    description: "Publish your first educational blog article to share knowledge.",
    actionButton: {
      label: "Write Article",
      location: "/blogs",
    },
  },
  {
    id: "videos",
    title: "No Video Lessons",
    description: "Add video tutorials, recordings, or lecture streams.",
    actionButton: {
      label: "Upload Video",
      location: "/videos",
    },
  },
  {
    id: "books",
    title: "No Books in Library",
    description: "Upload e-books and study resources for student learning.",
    actionButton: {
      label: "Add Book",
      location: "/books",
    },
  },
];
