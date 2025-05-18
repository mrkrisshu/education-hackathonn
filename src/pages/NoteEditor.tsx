import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Tag,
  Folder,
  Save,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NoteEditor: React.FC = () => {
  const { notes, updateNotes } = useApp();
  const [selectedNote, setSelectedNote] = useState<typeof notes[0] | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'Programming',
    tags: [] as string[],
  });

  // Get unique categories
  const categories = ['all', ...new Set(notes.map(note => note.category))];

  const filteredNotes = notes.filter(note => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    if (selectedCategory !== 'all') {
      return note.category === selectedCategory;
    }
    return true;
  });

  const handleNoteSelect = (note: typeof notes[0]) => {
    setSelectedNote(note);
  };

  const handleContentChange = (content: string) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, content };
      setSelectedNote(updatedNote);
      
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      );
      updateNotes(updatedNotes);
    }
  };

  const addNote = () => {
    if (!newNote.title) return;

    const newNoteObj = {
      id: Math.max(0, ...notes.map(note => note.id)) + 1,
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNoteObj];
    updateNotes(updatedNotes);
    setNewNote({
      title: '',
      content: '',
      category: 'Programming',
      tags: [],
    });
    setShowAddModal(false);
    setSelectedNote(newNoteObj);
  };

  const deleteNote = (noteId: number) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    updateNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-7rem)]"
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                Notes
              </h1>
              <motion.button
                className="btn-primary flex items-center text-sm px-3 py-1.5"
                onClick={() => setShowAddModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="mr-1 h-4 w-4" />
                New
              </motion.button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <select
                className="w-full text-sm rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNotes.map(note => (
              <motion.div
                key={note.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedNote?.id === note.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => handleNoteSelect(note)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {note.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <Folder className="h-3 w-3 mr-1" />
                  {note.category}
                </div>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notes found</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          {selectedNote ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedNote.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowPreview(!showPreview)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPreview ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                    onClick={() => deleteNote(selectedNote.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 ${showPreview ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}>
                  <textarea
                    className="w-full h-full p-4 bg-transparent border-0 focus:ring-0 resize-none"
                    value={selectedNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Write your note here..."
                  />
                </div>

                {showPreview && (
                  <div className="flex-1 p-4 overflow-y-auto prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedNote.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a note to edit
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a note from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Note</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      placeholder="Enter note title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      className="input"
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    >
                      {categories.filter(c => c !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center"
                        >
                          {tag}
                          <button
                            className="ml-1"
                            onClick={() => setNewNote({
                              ...newNote,
                              tags: newNote.tags.filter((_, i) => i !== index)
                            })}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        className="input flex-1"
                        placeholder="Add tags..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            e.preventDefault();
                            setNewNote({
                              ...newNote,
                              tags: [...newNote.tags, e.currentTarget.value]
                            });
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Initial Content
                    </label>
                    <textarea
                      className="input"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      placeholder="Start writing..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="btn-outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={addNote}
                    disabled={!newNote.title}
                  >
                    Create Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoteEditor;