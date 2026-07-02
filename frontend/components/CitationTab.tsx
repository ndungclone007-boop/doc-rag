import type { Citation } from "@/lib/types";

export function CitationTab({
  citation,
  onClick,
}: {
  citation: Citation;
  onClick: (citation: Citation) => void;
}) {
  return (
    <button
      type="button"
      className="citation-tab"
      onClick={() => onClick(citation)}
      title={citation.snippet}
    >
      tr. {citation.page}
    </button>
  );
}
