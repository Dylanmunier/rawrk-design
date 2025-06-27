import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

interface AdminCrudSectionProps {
  title: string;
  table: string;
  fields: FieldConfig[];
  fetchRows: () => Promise<any[]>;
  addRow: (row: any) => Promise<any>;
  updateRow: (row: any) => Promise<any>;
  deleteRow: (id: string) => Promise<any>;
}

export default function AdminCrudSection({ title, table, fields, fetchRows, addRow, updateRow, deleteRow }: AdminCrudSectionProps) {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState<any|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await fetchRows();
      setRows(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editing) {
        await updateRow({ ...form, id: editing.id });
        toast({ title: 'Modifié avec succès' });
      } else {
        await addRow(form);
        toast({ title: 'Ajouté avec succès' });
      }
      setForm({});
      setEditing(null);
      refresh();
    } catch (e: any) {
      setError(e.message || 'Erreur');
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cette entrée ?')) return;
    setLoading(true);
    try {
      await deleteRow(id);
      toast({ title: 'Supprimé avec succès' });
      refresh();
    } catch (e: any) {
      setError(e.message || 'Erreur');
      toast({ title: 'Erreur', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  }

  function handleEdit(row: any) {
    setEditing(row);
    setForm(row);
  }

  function handleCancel() {
    setEditing(null);
    setForm({});
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg border">
        {fields.map(f => (
          <div key={f.name}>
            <FormLabel>{f.label}{f.required && ' *'}</FormLabel>
            <Input
              name={f.name}
              type={f.type || 'text'}
              value={form[f.name] || ''}
              onChange={handleChange}
              required={f.required}
              className="w-40"
            />
          </div>
        ))}
        <Button type="submit" disabled={loading} variant="default">
          {editing ? 'Enregistrer' : 'Ajouter'}
        </Button>
        {editing && <Button type="button" onClick={handleCancel} variant="outline">Annuler</Button>}
        {error && <span className="text-red-600 font-bold ml-4">{error}</span>}
      </form>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map(f => <TableHead key={f.name}>{f.label}</TableHead>)}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.id}>
                {fields.map(f => <TableCell key={f.name}>{row[f.name]}</TableCell>)}
                <TableCell>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Éditer</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)} className="ml-2">Supprimer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 