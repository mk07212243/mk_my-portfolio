import { Highlight, themes } from "prism-react-renderer";
import type { Language } from "../data/problems";

const prismLanguage: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  c: "c",
};

export function CodeBlock({ code, language }: { code: string; language: Language }) {
  return (
    <Highlight code={code} language={prismLanguage[language]} theme={themes.nightOwl}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto rounded-lg p-4 text-sm leading-relaxed`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
