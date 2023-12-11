import {
  BlockNoteEditor,
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
  mergeCSSClasses,
} from "@blocknote/core";
import { MantineProvider, createStyles } from "@mantine/core";
import { EditorContent } from "@tiptap/react";
import { HTMLAttributes, ReactNode, useMemo } from "react";
import usePrefersColorScheme from "use-prefers-color-scheme";
import { 
  Theme, 
  blockNoteToMantineTheme,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  ImageToolbarPositioner,
  SideMenuPositioner,
  SlashMenuPositioner,
  TableHandlesPositioner,
  darkDefaultTheme,
  lightDefaultTheme
} from "@blocknote/react";

import { LinkingMenuItem, LinkingMenuPositioner } from "./linking-menu-positioner";
import { SuggestionPluginManager } from "@/lib/blockNote/suggestion-plugin";

// Renders the editor as well as all menus & toolbars using default styles.
function BaseBlockNoteView<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
  T extends LinkingMenuItem,
>(
  props: {
    editor: BlockNoteEditor<BSchema, ISchema, SSchema>;
    suggestionPluginManager: SuggestionPluginManager<T>;
    itemCallback: (item: T) => void;
    children?: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
) {
  const { classes } = createStyles({ root: {} })(undefined, {
    name: "Editor",
  });

  const { editor, children, className, suggestionPluginManager, itemCallback, ...rest } = props;

  return (
    <EditorContent
      editor={props.editor?._tiptapEditor}
      className={mergeCSSClasses(classes.root, props.className || "")}
      {...rest}>
      {props.children || (
        <>
          <FormattingToolbarPositioner editor={props.editor} />
          <HyperlinkToolbarPositioner editor={props.editor} />
          <SlashMenuPositioner editor={props.editor} />
          <SideMenuPositioner editor={props.editor} />
          <LinkingMenuPositioner 
            editor={props.editor}
            suggestionPluginManager={props.suggestionPluginManager}
            _itemCallback={props.itemCallback} />
          <ImageToolbarPositioner editor={props.editor} />
          {props.editor.blockSchema.table && (
            <TableHandlesPositioner editor={props.editor as any} />
          )}
        </>
      )}
    </EditorContent>
  );
}

export function CustomBlockNoteView<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
  T extends LinkingMenuItem,
>(
  props: {
    editor: BlockNoteEditor<BSchema, ISchema, SSchema>;
    suggestionPluginManager: SuggestionPluginManager<T>;
    itemCallback: (item: T) => void;
    theme?:
      | "light"
      | "dark"
      | Theme
      | {
          light: Theme;
          dark: Theme;
        };
    children?: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
) {
  const {
    theme = { light: lightDefaultTheme, dark: darkDefaultTheme },
    ...rest
  } = props;

  const preferredTheme = usePrefersColorScheme();

  const mantineTheme = useMemo(() => {
    if (theme === "light") {
      return blockNoteToMantineTheme(lightDefaultTheme);
    }

    if (theme === "dark") {
      return blockNoteToMantineTheme(darkDefaultTheme);
    }

    if ("light" in theme && "dark" in theme) {
      return blockNoteToMantineTheme(
        theme[preferredTheme === "dark" ? "dark" : "light"]
      );
    }

    return blockNoteToMantineTheme(theme);
  }, [preferredTheme, theme]);

  return (
    <MantineProvider theme={mantineTheme}>
      <BaseBlockNoteView {...rest} />
    </MantineProvider>
  );
}
