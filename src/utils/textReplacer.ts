export const findAndReplaceText = (
  editor: HTMLElement,
  sectionTitle: string,
  suggestionText: string
): boolean => {
  console.log('Starting text replacement...');
  console.log('Section to replace:', sectionTitle);
  console.log('New content:', suggestionText);
  console.log('Current editor content:', editor.innerHTML);

  // Clean up the section title for comparison
  const cleanSectionTitle = sectionTitle
    .split(':')[0]  // Take only the part before the colon
    .replace(/\*\*/g, '')  // Remove asterisks
    .replace(/^\d+\.\s*/, '')  // Remove leading numbers and dots
    .toLowerCase()
    .trim();

  // Format the suggestion text
  const formattedSuggestion = !suggestionText.includes('<') 
    ? `<p>${suggestionText.replace(/\*\*/g, '')}</p>`
    : suggestionText;

  let found = false;
  const paragraphs = Array.from(editor.children) as HTMLElement[];
  
  console.log('Number of paragraphs:', paragraphs.length);
  
  // First try exact match
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.textContent?.toLowerCase().trim() || '';
    
    console.log(`Checking paragraph ${i + 1}:`, paragraphText);

    if (paragraphText === cleanSectionTitle) {
      console.log('Found exact match!');
      paragraph.outerHTML = formattedSuggestion;
      found = true;
      break;
    }
  }

  // If no exact match found, try fuzzy matching
  if (!found) {
    console.log('No exact match found, trying fuzzy match...');
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const paragraphText = paragraph.textContent?.toLowerCase() || '';
      
      // Clean up the paragraph text
      const cleanParagraphText = paragraphText
        .replace(/\*\*/g, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/:/g, '')
        .trim();

      // Get significant words from the title
      const titleWords = cleanSectionTitle
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'your'].includes(word));

      console.log('Title words to match:', titleWords);

      // Count matching words
      const matchingWords = titleWords.filter(word => {
        const matches = cleanParagraphText.includes(word);
        console.log(`Word "${word}": ${matches ? 'found' : 'not found'}`);
        return matches;
      });

      const matchThreshold = Math.max(2, Math.floor(titleWords.length * 0.6));
      console.log(`Match threshold: ${matchThreshold}, Matches found: ${matchingWords.length}`);

      if (matchingWords.length >= matchThreshold) {
        console.log('Found fuzzy match!');
        console.log('Original:', paragraph.outerHTML);
        console.log('Replacing with:', formattedSuggestion);
        
        paragraph.outerHTML = formattedSuggestion;
        
        // Trigger input event to update React state
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);
        
        found = true;
        break;
      }
    }
  }

  if (!found) {
    console.log('No matching section found');
  }

  return found;
};