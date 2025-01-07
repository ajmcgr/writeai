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

    // More flexible matching - check if the texts share enough common words
    const sectionWords = new Set(cleanSectionTitle.split(/\s+/));
    const paragraphWords = new Set(cleanParagraphText.split(/\s+/));
    
    // Calculate word overlap
    const commonWords = [...sectionWords].filter(word => 
      paragraphWords.has(word) && 
      word.length > 3 && // Only consider words longer than 3 characters
      !['the', 'and', 'for', 'with'].includes(word) // Exclude common words
    );
    
    // If there's significant overlap (at least 3 matching words), consider it a match
    if (commonWords.length >= 3) {
      console.log('Found matching section with common words:', commonWords);
      
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