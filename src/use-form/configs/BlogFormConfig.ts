import { FormFieldConfig } from "@/use-form/ControllerMap";

interface BlogFormConfigProps {
  control: any;
}

const BlogFormConfig = ({
  control,
}: BlogFormConfigProps): FormFieldConfig[] => {
  return [
    {
      name: "title",
      label: "Article Title",
      type: "text",
      placeholder: "e.g. Modern Web Architecture with React 19",
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12 sm:col-span-8",
      rules: { required: true },
      control,
    },
    {
      name: "readTime",
      label: "Read Time",
      type: "text",
      placeholder: "e.g. 6 min read",
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12 sm:col-span-4",
      control,
    },
    {
      name: "excerpt",
      label: "Short Excerpt",
      type: "textarea",
      placeholder: "Brief introduction summarizing key takeaways...",
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12",
      rules: { required: true },
      control,
    },
    {
      name: "content",
      label: "Full Article Content (Markdown or Text)",
      type: "textarea",
      placeholder: "Write the full body of the article here...",
      inputClassName: "rounded-lg border-slate-200 shadow-none min-h-[140px]",
      className: "col-span-12",
      rules: { required: true },
      control,
    },
    {
      name: "coverImage",
      label: "Cover Image URL",
      type: "text",
      placeholder: "https://images.unsplash.com/...",
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12",
      control,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Development", label: "Development" },
        { value: "Data & AI", label: "Data & AI" },
        { value: "Design", label: "Design" },
        { value: "Business", label: "Business" },
      ],
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12 sm:col-span-4",
      control,
    },
    {
      name: "author",
      label: "Author Name",
      type: "text",
      placeholder: "e.g. Dr. Sarah Jenkins",
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12 sm:col-span-4",
      control,
    },
    {
      name: "status",
      label: "Publish Status",
      type: "select",
      options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ],
      inputClassName: "rounded-lg border-slate-200 shadow-none",
      className: "col-span-12 sm:col-span-4",
      control,
    },
  ];
};

export default BlogFormConfig;
