export const findAndReplaceText = (
  editor: HTMLElement,
  sectionTitle: string,
  suggestionText: string
): boolean => {
  console.log('Looking for section:', sectionTitle);
  console.log('Suggestion text:', suggestionText);

  // Clean up the section title for comparison
  const cleanSectionTitle = sectionTitle
    .replace(/\*\*/g, '')  // Remove asterisks
    .replace(/^\d+\.\s*/, '')  // Remove leading numbers and dots
    .toLowerCase()
    .trim();

  // Format the suggestion text
  const formattedSuggestion = !suggestionText.includes('<') 
    ? `<p>${suggestionText.replace(/\*\*/g, '')}</p>`  // Remove asterisks and wrap in paragraph
    : suggestionText;

  let found = false;
  const paragraphs = Array.from(editor.children) as HTMLElement[];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.textContent?.toLowerCase() || '';
    
    // Clean up the paragraph text for comparison
    const cleanParagraphText = paragraphText
      .replace(/\*\*/g, '')  // Remove asterisks
      .replace(/^\d+\.\s*/, '')  // Remove leading numbers and dots
      .replace(/:/g, '')  // Remove colons
      .trim();

    console.log('Comparing with paragraph:', cleanParagraphText);

    // Check if the paragraph contains the key phrases from the section title
    const titleWords = cleanSectionTitle.split(/\s+/).filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word)
    );

    // Count how many significant words from the title appear in the paragraph
    const matchingWords = titleWords.filter(word => cleanParagraphText.includes(word));
    const matchThreshold = Math.min(2, Math.floor(titleWords.length / 2)); // At least 2 words or half of significant words

    if (matchingWords.length >= matchThreshold) {
      console.log('Found matching section with words:', matchingWords);
      
      // Replace the paragraph with the suggestion
      paragraph.outerHTML = formattedSuggestion;
      found = true;

      // Create and dispatch an input event to trigger state updates
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);
      
      console.log('Successfully replaced text');
      break;
    }
  }

  if (!found) {
    console.log('No matching section found');
  }

  return found;
};