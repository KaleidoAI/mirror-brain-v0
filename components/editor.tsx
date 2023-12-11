"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor } from "@blocknote/core";
import { Extension } from "@tiptap/core";
import { useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { LinkingMenuItem } from "./blockNote/linking-menu-positioner";
import { CustomBlockNoteView } from "./blockNote/custom-block-note-view";
import { useLinkingOnSelectItem, useLinkingPlugin } from "@/hooks/use-linking-plugin";

interface EditorProps {
  updateContent: (raw_content: string) => void;
  updateMarkdown: (markdown: string) => void;
  initialContent?: string;
  editable: boolean;
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

  const { suggestionPluginManager, linkingSuggestionsMenu } = useLinkingPlugin(
    editable,
    (query) => [{name: "abc"}, {name: "def"}],
  );

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent)
      : undefined, 
    onEditorContentChange: (editor) => {
      updateContent(JSON.stringify(editor.topLevelBlocks, null, 2));
      editor.blocksToMarkdownLossy(editor.topLevelBlocks)
        .then(markdown => 
          updateMarkdown(markdown));
    },
    uploadFile: handleUpload,
    _tiptapOptions: {
      extensions: [
        Extension.create({
          name: "LinkingSuggestionsMenuExtension",
    
          addProseMirrorPlugins: () => {
            return [
              linkingSuggestionsMenu.plugin,
            ];
          },
        }),
      ],
    }
  });

  const onSelectLink = (item: LinkingMenuItem, editor: BlockNoteEditor) => {
    console.log(item.name);
  }

  const itemCallback = (item: LinkingMenuItem) => {
    linkingSuggestionsMenu.itemCallback(item, editor, onSelectLink);
  }

  useLinkingOnSelectItem(editor, suggestionPluginManager, onSelectLink);

  return (
    <div>
      <CustomBlockNoteView
        editor={editor}
        suggestionPluginManager={suggestionPluginManager}
        itemCallback={itemCallback}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

export default Editor;
