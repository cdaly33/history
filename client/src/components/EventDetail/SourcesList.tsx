import type { Source } from '../../../../shared/types';

interface SourcesListProps {
  sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) {
    return <p className="no-sources">No sources listed</p>;
  }

  return (
    <ol className="sources-list">
      {sources.map((source) => (
        <li key={source.id} className="source-item">
          <div className="source-content">
            {source.author && <span className="source-author">{source.author}, </span>}
            <span className="source-title">{source.title}</span>
            {source.publication && (
              <span className="source-publication">. <em>{source.publication}</em></span>
            )}
            {source.year && <span className="source-year"> ({source.year})</span>}
            {!source.verified && (
              <span className="source-badge suggested">Suggested — Verify</span>
            )}
          </div>
          {source.url && (
            <div className="source-link">
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                View Source
              </a>
            </div>
          )}
          {source.notes && <p className="source-notes">{source.notes}</p>}
        </li>
      ))}
    </ol>
  );
}
