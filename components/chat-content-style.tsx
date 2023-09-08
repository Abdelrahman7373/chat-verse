interface ChatContentStyleProps {
  text: string;
  maxWordsPerLine: number;
}

function splitTextIntoLines(text: string, maxWordsPerLine: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine: string[] = [];

  for (const word of words) {
    if (currentLine.length < maxWordsPerLine) {
      currentLine.push(word);
    } else {
      lines.push(currentLine.join(' '));
      currentLine = [word];
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines;
}

function ChatContentStyle({ text, maxWordsPerLine }: ChatContentStyleProps) {
  const lines = splitTextIntoLines(text, maxWordsPerLine);

  return (
    <div>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export default ChatContentStyle;
