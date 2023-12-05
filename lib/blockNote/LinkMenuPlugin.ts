import { Plugin, PluginKey } from "prosemirror-state";

import { 
  BlockNoteEditor,
  SuggestionsMenuState,
  setupSuggestionsMenu,
  BlockSchema, 
  InlineContentSchema, 
  StyleSchema,
  BaseSlashMenuItem
} from "@blocknote/core";
import { EventEmitter } from "./EventEmitter";

export const linkMenuPluginKey = new PluginKey("LinkMenuPlugin");

export class LinkMenuProsemirrorPlugin<
  BSchema extends BlockSchema,
  I extends InlineContentSchema,
  S extends StyleSchema,
  LinkMenuItem extends BaseSlashMenuItem<BSchema, I, S>
> extends EventEmitter<any> {
  public readonly plugin: Plugin;
  public readonly itemCallback: (item: LinkMenuItem) => void;

  constructor(editor: BlockNoteEditor<BSchema, I, S>, items: LinkMenuItem[]) {
    super();
    const suggestions = setupSuggestionsMenu<LinkMenuItem, BSchema, I, S>(
      editor,
      (state) => {
        this.emit("update", state);
      },
      linkMenuPluginKey,
      "@",
      (query) =>
        items.filter(
          ({ name, aliases }: LinkMenuItem) =>
            name.toLowerCase().startsWith(query.toLowerCase()) ||
            (aliases &&
              aliases.filter((alias) =>
                alias.toLowerCase().startsWith(query.toLowerCase())
              ).length !== 0)
        ),
      ({ item, editor }) => item.execute(editor)
    );

    this.plugin = suggestions.plugin;
    this.itemCallback = suggestions.itemCallback;
  }

  public onUpdate(
    callback: (state: SuggestionsMenuState<LinkMenuItem>) => void
  ) {
    return this.on("update", callback);
  }
}
