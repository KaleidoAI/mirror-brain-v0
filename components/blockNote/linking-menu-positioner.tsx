import {
  BlockNoteEditor,
  BlockSchema,
  DefaultBlockSchema,
  SuggestionItem,
  SuggestionsMenuState,
} from "@blocknote/core";
import Tippy from "@tippyjs/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { usePreventMenuOverflow } from "@/hooks/use-prevent-menu-overflow";
import { SuggestionPluginManager } from "@/lib/blockNote/suggestion-plugin";
import { DefaultLinkingMenu } from "./default-linking-menu";

export type LinkingMenuItem = SuggestionItem & {
  hint?: string;
  shortcut?: string;
};

export type LinkingMenuProps<T extends LinkingMenuItem> = Pick<
  SuggestionsMenuState<T>,
  "filteredItems" | "keyboardHoveredItemIndex"
> & {
  itemCallback: (item: T) => void;
};

export const LinkingMenuPositioner = <
  T extends LinkingMenuItem,
  BSchema extends BlockSchema = DefaultBlockSchema,
>(props: {
  editor: BlockNoteEditor<BSchema, any, any>;
  suggestionPluginManager: SuggestionPluginManager<T>;
  _itemCallback: (item: T) => void;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] =
    useState<T[]>();
  const [keyboardHoveredItemIndex, setKeyboardHoveredItemIndex] =
    useState<number>();

  const referencePos = useRef<DOMRect>();

  useEffect(() => {
    return props.suggestionPluginManager.registerOnUpdate((slashMenuState) => {
      setShow(slashMenuState.show);
      setFilteredItems(slashMenuState.filteredItems);
      setKeyboardHoveredItemIndex(slashMenuState.keyboardHoveredItemIndex);

      referencePos.current = slashMenuState.referencePos;
    });
  }, [props.editor]);

  const getReferenceClientRect = useMemo(
    () => {
      if (!referencePos.current) {
        return undefined;
      }

      return () => referencePos.current!;
    },
    [referencePos.current] // eslint-disable-line
  );

  const { ref, updateMaxHeight } = usePreventMenuOverflow();

  const slashMenuElement = useMemo(() => {
    if (!filteredItems || keyboardHoveredItemIndex === undefined) {
      return null;
    }

    return (
      <div ref={ref}>
        <DefaultLinkingMenu
          filteredItems={filteredItems}
          itemCallback={(item) => props._itemCallback(item)}
          keyboardHoveredItemIndex={keyboardHoveredItemIndex}
        />
      </div>
    );
  }, [
    filteredItems,
    keyboardHoveredItemIndex,
    props.suggestionPluginManager,
    ref,
  ]);

  return (
    <Tippy
      onShow={updateMaxHeight}
      appendTo={props.editor.domElement.parentElement!}
      content={slashMenuElement}
      getReferenceClientRect={getReferenceClientRect}
      interactive={true}
      visible={show}
      animation={"fade"}
      placement={"bottom-start"}
      zIndex={2000}
    />
  );
};
