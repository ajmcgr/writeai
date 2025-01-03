interface ContentDisplayProps {
  content: string;
}

export const ContentDisplay = ({ content }: ContentDisplayProps) => {
  if (!content) return null;

  return (
    <div className="mt-8 space-y-4 px-4 md:px-0">
      <h2 className="text-xl font-semibold">Generated Content:</h2>
      <div className="p-4 border rounded-lg whitespace-pre-wrap overflow-x-auto">
        {content}
      </div>
    </div>
  );
};