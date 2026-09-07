import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useHighlightedTextStyles } from "./styles";

interface HighlightedTextProps {
  searchText: string;
  sourceText: string;
}

const HighlightedText = ({ sourceText, searchText }: HighlightedTextProps) => {
  const styles = useHighlightedTextStyles();

  const normalizeWhitespace = (text: string): string => text.replace(/\s+/g, " ");

  const text = normalizeWhitespace(sourceText);
  const query = normalizeWhitespace(searchText);

  if (!query) return <>{text}</>;

  const normalizedText = text.toLowerCase();
  const normalizedSearchText = query.toLowerCase();
  const parts: Array<{ highlighted: boolean; text: string }> = [];
  let position = 0;
  let matchIndex = normalizedText.indexOf(normalizedSearchText);

  while (matchIndex !== -1) {
    if (matchIndex > position) {
      parts.push({
        text: text.slice(position, matchIndex),
        highlighted: false,
      });
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + query.length),
      highlighted: true,
    });
    position = matchIndex + query.length;
    matchIndex = normalizedText.indexOf(normalizedSearchText, position);
  }

  if (position < text.length) {
    parts.push({
      text: text.slice(position),
      highlighted: false,
    });
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className={mergeClasses(styles.text, part.highlighted && styles.highlighted)}>
          {part.text}
        </span>
      ))}
    </>
  );
};

export default HighlightedText;
