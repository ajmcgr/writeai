export const findAndReplaceText = (
  editor: HTMLElement,
  sectionTitle: string,
  suggestionText: string
): boolean => {
  console.log('Looking for section:', sectionTitle);
  console.log('Suggestion text:', suggestionText);

  const cleanSectionTitle = sectionTitle
    .replace(/\*\*/g, '')
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .trim();

  const paragraphs = Array.from(editor.children) as HTMLElement[];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.textContent?.trim() || '';
    const cleanParagraphText = paragraphText
      .toLowerCase()
      .replace(/\*\*/g, '')
      .replace(/^\d+\.\s*/, '')
      .trim();

    if (cleanParagraphText.includes(cleanSectionTitle)) {
      console.log('Found matching section:', paragraphText);
      paragraph.innerHTML = suggestionText;
      
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);
      return true;
    }
  }

  console.log('No matching section found for:', sectionTitle);
  return false;
}