export const findAndReplaceText = (
  editor: HTMLElement,
  sectionTitle: string,
  suggestionText: string
): boolean => {
  console.log('Looking for section:', sectionTitle);
  console.log('Suggestion text:', suggestionText);

  // Clean up the section title for comparison
  const cleanSectionTitle = sectionTitle
    .replace(/\*\*/g, '')
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .trim();

  // Convert NodeList to Array for easier manipulation
  const paragraphs = Array.from(editor.children) as HTMLElement[];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.textContent?.toLowerCase() || '';
    
    // Clean up the paragraph text for comparison
    const cleanParagraphText = paragraphText
      .replace(/\*\*/g, '')
      .replace(/^\d+\.\s*/, '')
      .trim();

    console.log('Comparing with paragraph:', cleanParagraphText);

    if (cleanParagraphText.includes(cleanSectionTitle)) {
      console.log('Found matching section:', paragraphText);
      
      // Format the suggestion text as HTML if it's not already
      const formattedSuggestion = !suggestionText.includes('<p>') 
        ? `<p>${suggestionText}</p>`
        : suggestionText;
      
      // Replace the content while preserving the paragraph element
      paragraph.innerHTML = formattedSuggestion;
      
      // Trigger input event to update state
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);
      
      console.log('Successfully replaced text');
      return true;
    }
  }

  console.log('No matching section found for:', sectionTitle);
  return false;
};