"use client";

import React from "react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Helper Tailwind style untuk tombol toolbar
const buttonClass = (active: boolean) =>
  `px-2 py-1 text-sm border rounded transition ${
    active ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
  }`;

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
      >
        Code
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={buttonClass(false)}
      >
        Clear Marks
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().run()}
        className={buttonClass(false)}
      >
        Clear Nodes
      </button>

      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={buttonClass(editor.isActive("heading", { level }))}
        >
          H{level}
        </button>
      ))}

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive("codeBlock"))}
      >
        Code Block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
      >
        Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
      >
        Horizontal Rule
      </button>
      <button
        onClick={() => editor.chain().focus().setHardBreak().run()}
        className={buttonClass(false)}
      >
        Hard Break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={buttonClass(false)}
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={buttonClass(false)}
      >
        Redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={buttonClass(
          editor.isActive("textStyle", { color: "#958DF1" })
        )}
      >
        Purple
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6], // wajib jika kamu ingin heading
    },
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
  }),
];

const content = `
<h2>Hello 👋</h2>
<p>This is <strong>Tiptap</strong> with Tailwind CSS and full toolbar.</p>
<pre><code>console.log("Tiptap works!");</code></pre>
<blockquote>Amazing! — You</blockquote>
`;

export default function TiptapEditor() {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
    >
      <EditorContent className="border rounded p-4 min-h-[200px]" />
    </EditorProvider>
  );
}
