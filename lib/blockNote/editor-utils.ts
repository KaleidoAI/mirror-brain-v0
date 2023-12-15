import { 
  BlockNoteEditor, 
  StyleSchema, 
  StyledText
} from "@blocknote/core";

export const addSpace = <
  T extends StyleSchema
>(editor: BlockNoteEditor) => {
  const currentBlock = editor.getTextCursorPosition().block;
  let blockContent = currentBlock.content as any[];
  blockContent.push({
    type: "text",
    text: " ",
    styles: {},
  } as StyledText<T>);
  editor.updateBlock(currentBlock, {content: blockContent})
  editor.setTextCursorPosition(currentBlock, "end");
}

export const addSpaceToLink = <
  T extends StyleSchema
>(editor: BlockNoteEditor) => {
  const currentBlock = editor.getTextCursorPosition().block;
  let blockContent = currentBlock.content as any[];
  if (blockContent.length === 0) return;
  if (blockContent[blockContent.length - 1].type === "link") {
    blockContent.push({
      type: "text",
      text: " ",
      styles: {},
    } as StyledText<T>);
    editor.updateBlock(currentBlock, {content: blockContent})
    editor.setTextCursorPosition(currentBlock, "end");
  }
}

export const deleteFrom = (
  queryRangeFrom: number, 
  editor: BlockNoteEditor
) => {
  editor._tiptapEditor
    .chain()
    .focus()
    .deleteRange({
      from: queryRangeFrom,
      to: editor._tiptapEditor.state.selection.from,
    })
    .run();
}
