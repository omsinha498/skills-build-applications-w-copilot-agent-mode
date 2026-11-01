import { useEffect, useState, type ReactNode } from 'react';
import { getJson } from '../api/client.js';

type Props<T> = {
  title: string;
  description: string;
  load: () => Promise<Record<string, unknown>>;
  collection: string;
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
};

type ViewState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; items: T[] };

export function CapabilityCard<T>({ title, description, load, collection, emptyMessage, renderItem }: Props<T>) {
  const [state, setState] = useState<ViewState<T>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    load()
      .then((data) => {
        const items = data[collection];
        if (!Array.isArray(items)) throw new Error(`Missing ${collection} response`);
        if (active) setState({ status: 'success', items: items as T[] });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });
    return () => { active = false; };
  }, [collection, load]);

  return <section className="card h-100"><div className="card-body">
    <h2 className="h4">{title}</h2>
    <p>{description}</p>
    {state.status === 'loading' && <p role="status">Loading {title.toLowerCase()}...</p>}
    {state.status === 'error' && <p role="alert">Unable to load {title.toLowerCase()}. Please try again later.</p>}
    {state.status === 'success' && state.items.length === 0 && <p role="status">{emptyMessage}</p>}
    {state.status === 'success' && state.items.length > 0 && <ul aria-label={title} className="mb-0">
      {state.items.map((item, index) => <li key={index}>{renderItem(item)}</li>)}
    </ul>}
  </div></section>;
}
