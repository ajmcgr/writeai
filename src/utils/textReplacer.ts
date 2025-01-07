export const findAndReplaceText = (
  editor: HTMLElement,
  sectionTitle: string,
  suggestionText: string
): boolean => {
  console.log('Looking for section:', sectionTitle);
  console.log('Suggestion text:', suggestionText);
  console.log('Current editor content:', editor.innerHTML);

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
  
  console.log('Number of paragraphs to check:', paragraphs.length);
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphText = paragraph.textContent?.toLowerCase() || '';
    
    // Clean up the paragraph text for comparison
    const cleanParagraphText = paragraphText
      .replace(/\*\*/g, '')  // Remove asterisks
      .replace(/^\d+\.\s*/, '')  // Remove leading numbers and dots
      .replace(/:/g, '')  // Remove colons
      .trim();

    console.log(`Checking paragraph ${i + 1}:`, cleanParagraphText);

    // Get significant words from the title (excluding common words and short words)
    const titleWords = cleanSectionTitle.split(/\s+/).filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'your'].includes(word)
    );

    console.log('Significant title words:', titleWords);

    // Count how many significant words from the title appear in the paragraph
    const matchingWords = titleWords.filter(word => {
      const matches = cleanParagraphText.includes(word);
      console.log(`Checking word "${word}": ${matches ? 'found' : 'not found'}`);
      return matches;
    });

    // Calculate threshold based on title length
    const matchThreshold = Math.max(2, Math.floor(titleWords.length * 0.4)); // At least 2 words or 40% of significant words
    
    console.log('Match threshold:', matchThreshold);
    console.log('Matching words found:', matchingWords);

    if (matchingWords.length >= matchThreshold) {
      console.log('Found matching section!');
      console.log('Original paragraph:', paragraph.outerHTML);
      console.log('Replacing with:', formattedSuggestion);
      
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