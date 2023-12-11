import { LinkingMenuItem } from "@/components/blockNote/linking-menu-positioner";
import { SuggestionMenuReturn, SuggestionPluginManager, setupSuggestionsMenu } from "@/lib/blockNote/suggestion-plugin";
import { DependencyList, useMemo, useRef, useEffect } from "react";
import type { BlockNoteEditor } from "@blocknote/core";
import { PluginKey } from "prosemirror-state";

export const useLinkingPlugin = <
  T extends LinkingMenuItem
>(
  editable: boolean,
  linkingMenuItems: (query: string) => T[] = () => [],
  deps: DependencyList = []
) => {
  const pluginManagerRef = useRef<SuggestionPluginManager<T>>();
  const suggestionPluginManager = useMemo(() => {
    if (pluginManagerRef.current) {
      pluginManagerRef.current.reset();
    }

    pluginManagerRef.current = new SuggestionPluginManager(editable);
    return pluginManagerRef.current!;
  }, deps); //eslint-disable-line react-hooks/exhaustive-deps

  const linkingSuggestionsMenuRef = useRef<SuggestionMenuReturn<T>>();
  const linkingSuggestionsMenu = useMemo(() => {
    const linkMenuPluginKey = new PluginKey("LinkingMenuPlugin");
    linkingSuggestionsMenuRef.current = setupSuggestionsMenu(
      suggestionPluginManager,
      linkMenuPluginKey,
      "@",
      linkingMenuItems,
    );

    return linkingSuggestionsMenuRef.current!;
  }, deps); //eslint-disable-line react-hooks/exhaustive-deps

  return { suggestionPluginManager, linkingSuggestionsMenu };
};

export const useLinkingOnSelectItem = <
  T extends LinkingMenuItem
>(
  editor: BlockNoteEditor,
  suggestionPluginManager: SuggestionPluginManager<T>,
  onSelectLink: (item: LinkingMenuItem, editor: BlockNoteEditor) => void
) => {
  useEffect(() => {
    return suggestionPluginManager.registerOnSelectItem(
      (queryRangeFrom, item) => {
        editor._tiptapEditor
          .chain()
          .focus()
          .deleteRange({
            from: queryRangeFrom,
            to: editor._tiptapEditor.state.selection.from,
          })
          .run();
  
        onSelectLink(item, editor);
      }
    );
  }, [editor]);
}
