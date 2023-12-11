import { createStyles, Menu } from "@mantine/core";

import type { LinkingMenuItem, LinkingMenuProps } from "./linking-menu-positioner";
import { LinkingMenuItemComponent } from "./linking-menu-item";

export function DefaultLinkingMenu<T extends LinkingMenuItem>(
  props: LinkingMenuProps<T>
) {
  const { classes } = createStyles({ root: {} })(undefined, {
    name: "LinkingMenu",
  });
  const renderedItems: any[] = [];
  let index = 0;

  for (const item of props.filteredItems) {
    renderedItems.push(
      <LinkingMenuItemComponent
        key={item.name + index}
        name={item.name}
        isSelected={props.keyboardHoveredItemIndex === index}
        set={() => props.itemCallback(item)}
      />
    );
    index++;
  };

  return (
    <Menu
      /** Hacky fix to get the desired menu behaviour. The trigger="hover"
       * attribute allows focus to remain on the editor, allowing for suggestion
       * filtering. The closeDelay=10000000 attribute allows the menu to stay open
       * practically indefinitely, as normally hovering off it would cause it to
       * close due to trigger="hover".
       */
      defaultOpened={true}
      trigger={"hover"}
      closeDelay={10000000}>
      <Menu.Dropdown
        // TODO: This should go back in the plugin.
        onMouseDown={(event) => event.preventDefault()}
        className={classes.root}>
        {renderedItems.length > 0 ? (
          renderedItems
        ) : (
          <Menu.Item>No match found</Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
