function getCaretOffset(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;
  const range = selection.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);
  return preRange.toString().length;
}

function setCaretOffset(el: HTMLElement, offset: number) {
  const range = document.createRange();
  const sel = window.getSelection();

  let charCount = 0, nodeStack: Node[] = [el], node: Node | undefined;

  while ((node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = (node as Text).length;
      if (charCount + textLength >= offset) {
        range.setStart(node, offset - charCount);
        range.collapse(true);
        break;
      } else {
        charCount += textLength;
      }
    } else {
      let i = node.childNodes.length;
      while (i--) nodeStack.push(node.childNodes[i]);
    }
  }

  sel?.removeAllRanges();
  sel?.addRange(range);
}

export { getCaretOffset, setCaretOffset };