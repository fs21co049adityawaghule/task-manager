import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { TodoList, TodoItem } from '../../types';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export const TodoFormModal: React.FC = () => {
  const { activeModal, closeModal, editingItem, addTodoList, updateTodoList } = useApp();

  const isOpen = activeModal === 'todo';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem && isOpen) {
      const list = editingItem as TodoList;
      setTitle(list.title || '');
      setDescription(list.description || '');
      setItems(list.items || []);
      setNewItemText('');
      setError('');
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setItems([
        { id: 'ti-1', text: 'First checklist task', completed: false },
        { id: 'ti-2', text: 'Second checklist task', completed: false }
      ]);
      setNewItemText('');
      setError('');
    }
  }, [editingItem, isOpen]);

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    setItems(prev => [...prev, { id: `ti-${Date.now()}`, text: newItemText.trim(), completed: false }]);
    setNewItemText('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a list title.');
      return;
    }
    if (items.length === 0) {
      setError('Please add at least one item to the list.');
      return;
    }

    if (editingItem?.id) {
      updateTodoList({
        ...editingItem,
        title: title.trim(),
        description: description.trim(),
        items,
        updatedAt: new Date().toISOString()
      });
    } else {
      addTodoList({
        title: title.trim(),
        description: description.trim(),
        items
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={editingItem ? 'Edit To-Do List' : 'Create To-Do List'}
      subtitle="Manage interactive item checklist"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            List Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., GATE Preparation Checklist"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Core subject modules to revise"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Progress Preview Bar */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-1 font-semibold">
            <span>Progress: {completedCount} of {items.length} completed</span>
            <span className="font-mono text-indigo-400 font-bold">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Items Checklist Builder */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Checklist Items</label>

          {/* Add New Item Row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
              placeholder="Add checklist item..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Item List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-sm group"
              >
                <div
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  onClick={() => handleToggleItem(item.id)}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`truncate ${
                      item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            {editingItem ? 'Save List' : 'Create List'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
