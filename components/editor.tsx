"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { setupSuggestionsMenu } from "@blocknote/core"
import { PluginKey } from "prosemirror-state";

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
    onEditorContentChange: (editor) => {
      updateContent(JSON.stringify(editor.topLevelBlocks, null, 2));
      editor.blocksToMarkdown(editor.topLevelBlocks)
        .then(markdown => 
          updateMarkdown(markdown));
    },
    uploadFile: handleUpload
  })

  // const linkMenuPluginKey = new PluginKey("LinkMenuPlugin");

  // const suggestions = setupSuggestionsMenu(
  //   editor,
  //   (state) => {
  //     // this.emit("update", state);
  //   },
  //   linkMenuPluginKey,
  //   "@",
  //   (query) => [{name: "abc"}, {name: "def"}],
  //     // items.filter(
  //     //   ({ name, aliases }: SlashMenuItem) =>
  //     //     name.toLowerCase().startsWith(query.toLowerCase()) ||
  //     //     (aliases &&
  //     //       aliases.filter((alias) =>
  //     //         alias.toLowerCase().startsWith(query.toLowerCase())
  //     //       ).length !== 0)
  //     // ),
  //   // ({ item, editor }) => item.execute(editor)
  // );

  // editor._tiptapEditor.registerPlugin(suggestions.plugin);

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
