import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListTodo, CheckCircle2, Circle, Plus, Trash2, Edit3 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const TodoListsSection: React.FC = () => {
  const { todoLists, toggleTodoItem, addTodoItem, deleteTodoList, openModal, setEditingItem } = useApp();
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});

  const handleAddItem = (listId: string) => {
    const text = newItemTexts[listId] || '';
    if (!text.trim()) return;
    addTodoItem(listId, text);
    setNewItemTexts(prev => ({ ...prev, [listId]: '' }));
  };

  return (
    <section className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 my-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-indigo-400" />
            <span>To-Do Checklists</span>
          </h3>
          <p className="text-xs text-slate-400">Interactive multi-item task checklists</p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            openModal('todo');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New To-Do List</span>
        </button>
      </div>

      {todoLists.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No To-Do Lists Created"
          description="Create checklist groups for subject topics, weekly errands, or project milestones."
          actionLabel="+ Create To-Do List"
          onAction={() => {
            setEditingItem(null);
            openModal('todo');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todoLists.map((list) => {
            const completedCount = list.items.filter(i => i.completed).length;
            const totalCount = list.items.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={list.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* List Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-slate-100">{list.title}</h4>
                      {list.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{list.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(list);
                          openModal('todo');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete to-do list "${list.title}"?`)) {
                            deleteTodoList(list.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-1.5 my-3">
                    {list.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleTodoItem(list.id, item.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer text-xs transition-colors"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span
                          className={`truncate flex-1 ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Quick Item Add Input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newItemTexts[list.id] || ''}
                      onChange={(e) =>
                        setNewItemTexts({ ...newItemTexts, [list.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem(list.id);
                        }
                      }}
                      placeholder="Add item..."
                      className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddItem(list.id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Overall Progress Indicator */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Progress: <strong className="text-white">{completedCount}/{totalCount}</strong>
                    </span>
                    <span className="font-mono font-bold text-indigo-400">{progressPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
