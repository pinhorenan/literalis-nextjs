'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@components/ui/Buttons';
import { SearchBar } from '@/src/components/ui/SearchBar';

const resources = ['books', 'posts', 'users'] as const;
type Resource = typeof resources[number];
type AnyObject = { id?: string; [key: string]: any };

export default function AdminPage() {
  const [resource, setResource] = useState<Resource>('books');
  const [data, setData] = useState<AnyObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('{}');
  const [editItem, setEditItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/${resource}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchTerm('');
    setExpandedId(null);
    setEditingId(null);
    setEditItem('');
  }, [resource]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      if (resource === 'users') {
        return item.username?.toLowerCase().includes(term) ||
               item.name?.toLowerCase().includes(term);
      }
      if (resource === 'books') {
        return item.title?.toLowerCase().includes(term);
      }
      if (resource === 'posts') {
        return item.title?.toLowerCase().includes(term) ||
               item.content?.toLowerCase().includes(term);
      }
      return JSON.stringify(item).toLowerCase().includes(term);
    });
  }, [searchTerm, data, resource]);

  const getItemKey = (item: AnyObject, index: number) =>
    item.id || item.username || item.title || `item-${index}`;

  const getLabel = (item: AnyObject) =>
    item.username || item.title || item.name || item.id || 'Sem nome';

  const startEdit = (item: AnyObject) => {
    const key = getItemKey(item, 0); // segurança
    setEditingId(String(key));
    setEditItem(JSON.stringify(item, null, 2));
  };

  const handleCreate = async () => {
    try {
      const payload = JSON.parse(newItem);
      const res = await fetch(`/api/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setNewItem('{}');
      fetchData();
    } catch (err: any) {
      alert('Falha: ' + err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const payload = JSON.parse(editItem);
      const res = await fetch(`/api/${resource}/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setEditingId(null);
      setEditItem('');
      fetchData();
    } catch (err: any) {
      alert('Falha: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Excluir ${resource.slice(0, -1)} ${id}?`)) return;
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      fetchData();
    } catch (err: any) {
      alert('Falha: ' + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--surface-card)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
        Administração de {resource.charAt(0).toUpperCase() + resource.slice(1)}
      </h1>

      <div className="flex gap-2">
        {resources.map(r => (
          <Button
            key={r}
            size="xs"
            variant={r === resource ? 'default' : 'outline'}
            onClick={() => setResource(r)}
          >
            {r}
          </Button>
        ))}
      </div>

      <SearchBar
        placeholder={`Pesquisar ${resource}...`}
        value={searchTerm}
        onChange={setSearchTerm}
        className="max-w-md"
      />

      {loading ? (
        <p className="text-sm text-[var(--text-secondary)]">Carregando...</p>
      ) : error ? (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-auto">
          {filtered.map((item, index) => {
            const key = getItemKey(item, index);
            return (
              <div
                key={key}
                className="p-3 flex flex-col gap-2 bg-[var(--surface-alt)] rounded-lg hover:shadow-[var(--shadow-sm)]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">
                      {getLabel(item)}
                    </span>
                    <span className="ml-2 text-xs text-[var(--text-tertiary)]">
                      ({key})
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="xs" onClick={() => startEdit(item)}>Editar</Button>
                    <Button size="xs" variant="destructive" onClick={() => handleDelete(String(item.id))}>
                      Excluir
                    </Button>
                    <Button
                      size="xs"
                      variant={expandedId === key ? 'default' : 'outline'}
                      onClick={() => setExpandedId(expandedId === key ? null : String(key))}
                    >
                      {expandedId === key ? 'Esconder' : 'Expandir'}
                    </Button>
                  </div>
                </div>

                {expandedId === key && (
                  <pre className="p-2 bg-[var(--surface-bg)] border border-[var(--border-base)] rounded font-mono text-xs max-h-40 overflow-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">Nenhum item encontrado.</p>
          )}
        </div>
      )}

      {/* CREATE */}
      <div className="space-y-2 border-t pt-4">
        <h2 className="font-medium text-[var(--text-primary)]">Criar novo</h2>
        <textarea
          className="w-full h-24 p-2 bg-[var(--surface-input)] border border-[var(--border-base)] rounded font-mono text-sm"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button size="xs" onClick={handleCreate}>
          Criar {resource.slice(0, -1)}
        </Button>
      </div>

      {/* EDIT */}
      {editingId && (
        <div className="space-y-2 border-t pt-4">
          <h2 className="font-medium text-[var(--text-primary)]">Editando: {editingId}</h2>
          <textarea
            className="w-full h-32 p-2 bg-[var(--surface-input)] border border-[var(--border-base)] rounded font-mono text-sm"
            value={editItem}
            onChange={(e) => setEditItem(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="xs" onClick={handleUpdate}>Salvar</Button>
            <Button size="xs" variant="outline" onClick={() => {
              setEditingId(null);
              setEditItem('');
            }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
