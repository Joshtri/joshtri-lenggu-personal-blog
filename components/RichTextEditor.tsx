"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
};

interface RichTextEditorProps {
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

// Dynamically import Quill with SSR disabled
const Quill = dynamic(() => import("quill"), { ssr: false });
import "quill/dist/quill.snow.css";

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  (
    {
      onChange,
      placeholder = "Mulai menulis konten Anda...",
      className,
      defaultValue,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null); // Use 'any' temporarily since Quill type isn't available server-side

    useEffect(() => {
      // Ensure Quill is only initialized in the browser
      if (
        typeof window !== "undefined" &&
        editorRef.current &&
        !quillRef.current
      ) {
        // Import Quill formats and initialize
        import("quill").then((QuillModule) => {
          const Quill = QuillModule.default;
          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            modules: {
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ size: ["small", false, "large", "huge"] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ script: "sub" }, { script: "super" }],
                  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  [{ direction: "rtl" }],
                  [{ align: [] }],
                  ["link", "image", "video", "formula"],
                  ["code-block"],
                  ["clean"],
                ],
              },
              history: {
                delay: 1000,
                maxStack: 50,
                userOnly: true,
              },
            },
            placeholder,
            formats: [
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "color",
              "background",
              "script",
              "list",
              "bullet",
              "check",
              "indent",
              "direction",
              "align",
              "link",
              "image",
              "video",
              "formula",
              "code-block",
            ],
          });

          // Set default content if provided
          if (defaultValue) {
            quillRef.current.root.innerHTML = defaultValue;
          }

          // Handle content changes
          quillRef.current.on("text-change", () => {
            if (quillRef.current && onChange) {
              const content = quillRef.current.root.innerHTML;
              onChange(content);
            }
          });
        });
      }

      return () => {
        if (quillRef.current) {
          quillRef.current.off("text-change");
        }
      };
    }, [onChange, placeholder, defaultValue]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML;
        }
        return "";
      },
      setContent: (content: string) => {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = content;
        }
      },
      focus: () => {
        if (quillRef.current) {
          quillRef.current.focus();
        }
      },
    }));

    return (
      <div className={cn("rich-text-editor", className)}>
        <div ref={editorRef} />
        <style jsx global>{`
          .rich-text-editor .ql-toolbar {
            border: none;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(to right, #f8fafc, #f1f5f9);
            border-radius: 12px 12px 0 0;
            padding: 12px 16px;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          }

          .rich-text-editor .ql-toolbar .ql-formats {
            margin-right: 12px;
          }

          .rich-text-editor .ql-toolbar .ql-formats:last-child {
            margin-right: 0;
          }

          .rich-text-editor .ql-toolbar button {
            border-radius: 6px;
            padding: 6px;
            margin: 0 2px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }

          .rich-text-editor .ql-toolbar button:hover {
            background-color: #e2e8f0;
            border-color: #cbd5e1;
          }

          .rich-text-editor .ql-toolbar button.ql-active {
            background-color: #3b82f6;
            color: white;
            border-color: #2563eb;
          }

          .rich-text-editor .ql-toolbar .ql-picker {
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .rich-text-editor .ql-toolbar .ql-picker:hover {
            background-color: #e2e8f0;
          }

          .rich-text-editor .ql-toolbar .ql-picker-label {
            border: 1px solid transparent;
            border-radius: 6px;
            padding: 6px 8px;
          }

          .rich-text-editor .ql-toolbar .ql-picker-label:hover {
            border-color: #cbd5e1;
          }

          .rich-text-editor .ql-container {
            border: none;
            font-family: ui-sans-serif, system-ui, -apple-system,
              BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
              "Noto Sans", sans-serif;
            font-size: 16px;
            line-height: 1.6;
            background: white;
            border-radius: 0 0 12px 12px;
          }

          .rich-text-editor .ql-editor {
            padding: 24px;
            min-height: 400px;
            color: #1e293b;
            background: white;
            border-radius: 0 0 12px 12px;
          }

          .rich-text-editor .ql-editor.ql-blank::before {
            color: #94a3b8;
            font-style: normal;
            font-weight: 400;
          }

          .rich-text-editor .ql-editor h1 {
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.2;
            margin: 1.5rem 0 1rem 0;
            color: #0f172a;
          }

          .rich-text-editor .ql-editor h2 {
            font-size: 1.875rem;
            font-weight: 600;
            line-height: 1.3;
            margin: 1.25rem 0 0.75rem 0;
            color: #1e293b;
          }

          .rich-text-editor .ql-editor h3 {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.4;
            margin: 1rem 0 0.5rem 0;
            color: #334155;
          }

          .rich-text-editor .ql-editor p {
            margin: 0.75rem 0;
            line-height: 1.7;
          }

          .rich-text-editor .ql-editor ul,
          .rich-text-editor .ql-editor ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }

          .rich-text-editor .ql-editor li {
            margin: 0.5rem 0;
            line-height: 1.6;
          }

          .rich-text-editor .ql-editor blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0 8px 8px 0;
          }

          .rich-text-editor .ql-editor code {
            background: #f1f5f9;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
              "Liberation Mono", Menlo, monospace;
            font-size: 0.875rem;
            color: #dc2626;
          }

          .rich-text-editor .ql-editor pre {
            background: #0f172a;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            overflow-x: auto;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
              "Liberation Mono", Menlo, monospace;
          }

          .rich-text-editor .ql-editor a {
            color: #3b82f6;
            text-decoration: underline;
            text-decoration-color: #93c5fd;
            text-underline-offset: 2px;
            transition: all 0.2s ease;
          }

          .rich-text-editor .ql-editor a:hover {
            color: #1d4ed8;
            text-decoration-color: #3b82f6;
          }

          .rich-text-editor .ql-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }

          .rich-text-editor .ql-editor .ql-video {
            width: 100%;
            height: 315px;
            border-radius: 8px;
            margin: 1rem 0;
          }

          /* Dark mode support */
          .dark .rich-text-editor .ql-toolbar {
            background: linear-gradient(to right, #1e293b, #334155);
            border-bottom-color: #475569;
          }

          .dark .rich-text-editor .ql-toolbar button:hover {
            background-color: #475569;
            border-color: #64748b;
          }

          .dark .rich-text-editor .ql-toolbar button.ql-active {
            background-color: #3b82f6;
            border-color: #2563eb;
          }

          .dark .rich-text-editor .ql-container,
          .dark .rich-text-editor .ql-editor {
            background: #1e293b;
            color: #e2e8f0;
          }

          .dark .rich-text-editor .ql-editor.ql-blank::before {
            color: #64748b;
          }

          .dark .rich-text-editor .ql-editor h1,
          .dark .rich-text-editor .ql-editor h2,
          .dark .rich-text-editor .ql-editor h3 {
            color: #f1f5f9;
          }

          .dark .rich-text-editor .ql-editor blockquote {
            background: #334155;
            border-left-color: #3b82f6;
          }

          .dark .rich-text-editor .ql-editor code {
            background: #334155;
            color: #fca5a5;
          }

          /* Responsive design */
          @media (max-width: 768px) {
            .rich-text-editor .ql-toolbar {
              padding: 8px 12px;
            }

            .rich-text-editor .ql-toolbar .ql-formats {
              margin-right: 8px;
            }

            .rich-text-editor .ql-editor {
              padding: 16px;
              min-height: 300px;
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
