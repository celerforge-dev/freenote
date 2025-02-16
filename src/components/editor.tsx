"use client";

import {
  MDXEditor,
  MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC } from "react";

interface EditorProps extends MDXEditorProps {
  onVlaueChange: (value: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ onVlaueChange, ...props }: EditorProps) => {
  return (
    <MDXEditor
      onChange={onVlaueChange}
      contentEditableClassName="prose"
      className="prose prose-stone"
      {...props}
      plugins={[
        headingsPlugin({}),
        listsPlugin(),
        tablePlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default Editor;
