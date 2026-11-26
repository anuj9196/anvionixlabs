/** Text typed key by key with a blinking caret. Pure CSS, so the words are in the HTML from the start. */
export function TypeText({ text, start = 0, speed = 32, caret = false }: { text: string; start?: number; speed?: number; caret?: boolean }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="type-ch" style={{ animationDelay: `${start + i * speed}ms` }}>
          {ch}
        </span>
      ))}
      {caret && <span aria-hidden className="type-caret" style={{ animationDelay: `${start + text.length * speed}ms` }} />}
    </>
  );
}
