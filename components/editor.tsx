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
import { addSpace, addSpaceToLink } from "@/lib/blockNote/editor-utils";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface EditorProps {
  updateContent: (raw_content: string) => void;
  updateMarkdown: (markdown: string) => void;
  initialContent?: string;
  editable: boolean;
  id: string;
};

type LinkingPageItem = LinkingMenuItem & {
  page_id: string;
};

const Editor = ({
  updateContent,
  updateMarkdown,
  initialContent,
  editable,
  id
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const allPages = useQuery(api.pages.getAllPages);

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  const { suggestionPluginManager, linkingSuggestionsMenu } = useLinkingPlugin<LinkingPageItem>(
    editable,
    (query) => {
      if (!allPages) return [];
      const results = allPages.filter(
        ({ title }) =>
          title.toLowerCase().startsWith(query.toLowerCase())
      );
      return results.map((page) => {
        return {
          name: page.title,
          page_id: page._id
        };
      });
    },
  );

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent)
      : undefined, 
    domAttributes: {
      // Adds a class to all `blockContainer` elements.
      blockContainer: {
        class: "editorLink",
      },
    },
    onEditorContentChange: (editor) => {
      addSpaceToLink(editor);
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

  const onSelectLink = (item: LinkingPageItem, editor: BlockNoteEditor) => {
    editor.createLink(`/pages/${item.page_id}`, item.name);
    addSpace(editor);
  }

  const itemCallback = (item: LinkingPageItem) => {
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
