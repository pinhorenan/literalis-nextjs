'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Buttons';

const resources = ['books', 'posts', 'users']; // Ajuste conforme seus endpoints

type AnyObject = { id: string; [key: string]: any };

export default function AdminPage() {
  const [resource, setResource] = useState<string>(resources[0]);
  const [data, setData] = useState<AnyObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<string>('{}');
  const [editItem, setEditItem] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carrega dados
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/${resource}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData() }, [resource]);

  // Cria novo
  async function handleCreate() {
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
  }

  // Deleta
  async function handleDelete(id: string) {
    if (!confirm(`Excluir ${resource.replace(/s$/, '')} ${id}?`)) return;
    try {
      const res = await fetch(`/api/${resource}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      fetchData();
    } catch (err: any) {
      alert('Falha: ' + err.message);
    }
  }

  // Edita
  function startEdit(item: AnyObject) {
    setEditingId(item.id);
    setEditItem(JSON.stringify(item, null, 2));
  }

  async function handleUpdate() {
    if (!editingId) return;
    try {
      const payload = JSON.parse(editItem);
      const res = await fetch(`/api/${resource}/${editingId}`, {
        method: 'PUT',
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
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Administração de APIs</h1>

      {/* Seletor de recursos */}
      <div className="flex items-center gap-2">
        {resources.map((resName) => (
          <Button
            key={resName}
            variant={resName === resource ? 'default' : 'outline'}
            size="xs"
            onClick={() => setResource(resName)}
          >
            {resName}
          </Button>
        ))}
      </div>

      {/* Tabela */}
      {loading ? (
        <p className="text-sm">Carregando...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <table className="w-full text-sm table-fixed border-collapse">
          <thead>
            <tr className="bg-[var(--surface-alt)]">
              <th className="border p-1">ID</th>
              <th className="border p-1">Dados</th>
              <th className="border p-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-card-hover)]">
                <td className="border p-1 align-top">{item.id}</td>
                <td className="border p-1 font-mono whitespace-pre-wrap overflow-x-auto max-h-48">
                  {JSON.stringify(item, null, 2)}
                </td>
                <td className="border p-1 flex flex-col gap-1">
                  <Button
                    key={`edit-${item.id}`}
                    size="xs"
                    onClick={() => startEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    key={`delete-${item.id}`}
                    size="xs"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Criação */}
      <div className="pt-2 space-y-2">
        <textarea
          className="w-full h-24 p-1 border rounded font-mono text-sm"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button size="xs" onClick={handleCreate}>
          Criar {resource.replace(/s$/, '')}
        </Button>
      </div>

      {/* Edição */}
      {editingId && (
        <div className="pt-2 space-y-2">
          <textarea
            className="w-full h-24 p-1 border rounded font-mono text-sm"
            value={editItem}
            onChange={(e) => setEditItem(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="xs" onClick={handleUpdate}>
              Salvar
            </Button>
            <Button size="xs" variant="outline" onClick={() => setEditingId(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
