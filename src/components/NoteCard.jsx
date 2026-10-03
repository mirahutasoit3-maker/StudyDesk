import React from 'react';
import { showShortDate } from '../utils';

function NoteCard({ note, onEdit, onDelete, onArchive, onPin }) {
  return (
    <article className={`note-card ${note.pinned ? 'note-card--pinned' : ''}`}>
      <div className="note-card__top">
        <span className="category-badge">{note.category || 'Dokumen'}</span>
        <button
          className={`pin-button ${note.pinned ? 'pin-button--active' : ''}`}
          type="button"
          onClick={() => onPin(note.id)}
          title={note.pinned ? 'Lepas sematan' : 'Sematkan dokumen'}
          aria-label={note.pinned ? 'Lepas sematan' : 'Sematkan dokumen'}
        >
          {note.pinned ? '★' : '☆'}
        </button>
      </div>

      <h3>{note.title}</h3>
      <p className="note-card__body">{note.body}</p>

      <div className="note-card__meta">
        <span>{showShortDate(note.updatedAt || note.createdAt)}</span>
        {note.archived && <span className="archived-label">Diarsipkan</span>}
      </div>

      <div className="note-card__actions">
        <button type="button" onClick={() => onEdit(note)}>Perbarui</button>
        <button type="button" onClick={() => onArchive(note.id)}>
          {note.archived ? 'Pulihkan' : 'Arsipkan'}
        </button>
        <button className="danger-link" type="button" onClick={() => onDelete(note.id)}>
          Eliminasi
        </button>
      </div>
    </article>
  );
}

export default NoteCard;
