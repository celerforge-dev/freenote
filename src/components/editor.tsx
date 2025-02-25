"use client";

import {
  MDXEditor,
  MDXEditorProps,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC } from "react";

interface EditorProps extends MDXEditorProps {
  onValueChange: (value: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ onValueChange, ...props }: EditorProps) => {
  return (
    <MDXEditor
      onChange={onValueChange}
      contentEditableClassName="prose prose-stone !p-0"
      {...props}
      plugins={[
        headingsPlugin({}),
        listsPlugin(),
        tablePlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: "js",
        }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            ts: "TypeScript",
            html: "HTML",
            python: "Python",
            bash: "Bash",
            json: "JSON",
            yaml: "YAML",
            markdown: "Markdown",
            sql: "SQL",
            xml: "XML",
          },
        }),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default Editor;
