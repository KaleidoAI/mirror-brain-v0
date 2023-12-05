"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@/packages/core/src";
import {
  BlockNoteView,
  useBlockNote
} from "@/packages/react/src";
import "@/packages/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  updateContent: (raw_content: string) => void;
  updateMarkdown: (markdown: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  updateContent,
  updateMarkdown,
  initialContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent) //as PartialBlock[] 
      : undefined,
    onEditorContentChange: (editor: BlockNoteEditor) => {
      updateContent(JSON.stringify(editor.topLevelBlocks, null, 2));
      editor.blocksToMarkdownLossy(editor.topLevelBlocks)
        .then(markdown => 
          updateMarkdown(markdown));
    },
    uploadFile: handleUpload
  })

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

export default Editor;
