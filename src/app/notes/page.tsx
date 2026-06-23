'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useNoteStore } from '@/store';
import { generateId } from '@/utils';
import { cn } from '@/utils/cn';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Search,
  Folder,
  FileText,
  FolderPlus,
  Eye,
  EyeOff,
  Clock,
  StickyNote,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotesPage() {
  const { t } = useLanguage();
  const { notes, addNote, updateNote, removeNote, folders, addFolder } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteFolder] = useState('General');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder = !selectedFolder || n.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [notes, searchQuery, selectedFolder]);

  useEffect(() => {
    if (selectedNote) {
      Promise.resolve().then(() => {
        setTitle(selectedNote.title);
        setContent(selectedNote.content);
      });
    } else {
      Promise.resolve().then(() => {
        setTitle('');
        setContent('');
      });
    }
  }, [selectedNote]);

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      Promise.resolve().then(() => setSelectedNoteId(notes[0].id));
    }
  }, [notes, selectedNoteId]);


  const handleSave = useCallback(() => {
    if (selectedNoteId) {
      updateNote(selectedNoteId, { title, content });
    }
  }, [selectedNoteId, title, content, updateNote]);

  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveRef.current();
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content]);

  const handleCreateNote = () => {
    if (!noteTitle.trim()) return;
    const note = {
      id: generateId(),
      title: noteTitle.trim(),
      content: '',
      folder: noteFolder,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addNote(note);
    setSelectedNoteId(note.id);
    setNoteTitle('');
    setNoteDialogOpen(false);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName('');
    setFolderDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedNoteId) return;
    removeNote(selectedNoteId);
    setSelectedNoteId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] space-y-0">
      <div className="relative overflow-hidden mb-4">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
            >
              <StickyNote className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-amber-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                  </span>
                  Markdown
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
                {t.nav.notes}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                {t.notes.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.notes.newFolder}</DialogTitle>
                  <DialogDescription>Create a new folder to organize your notes</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder={t.notes.folderName}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t.common.cancel}</Button>
                    </DialogClose>
                    <Button onClick={handleAddFolder}>{t.common.create}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t.notes.newNote}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.notes.newNote}</DialogTitle>
                  <DialogDescription>Create a new markdown note</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
placeholder={t.notes.noteTitle}
                    value={noteTitle}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">{t.common.cancel}</Button>
                    </DialogClose>
                    <Button onClick={handleCreateNote}>{t.common.create}</Button>
                  </div>
                </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="h-full flex flex-col">
            <CardContent className="p-3 space-y-3 flex flex-col h-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder={t.notes.searchNotes}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="flex-1 -mx-3 px-3">
                <div className="space-y-1 mb-3">
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className={cn(
                      'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all',
                      !selectedFolder ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    {t.notes.allNotes}
                    <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                      {notes.length}
                    </Badge>
                  </button>
                  {folders.map((folder) => {
                    const count = notes.filter((n) => n.folder === folder).length;
                    return (
                      <button
                        key={folder}
                        onClick={() => setSelectedFolder(folder)}
                        className={cn(
                          'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all',
                          selectedFolder === folder
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <Folder className="w-4 h-4" />
                        {folder}
                        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {filteredNotes.map((note) => (
                      <motion.button
                        key={note.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onClick={() => setSelectedNoteId(note.id)}
                        className={cn(
                          'w-full text-left rounded-md px-3 py-2.5 transition-all group',
                          selectedNoteId === note.id
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        )}
                      >
                        <p className="text-sm font-medium text-white truncate">{note.title || t.notes.untitled}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {note.folder}
                          </Badge>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {filteredNotes.length === 0 && (
                    <p className="text-xs text-white/30 text-center py-8">
                      {searchQuery ? t.notes.noMatch : t.notes.noNotes}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {selectedNote ? (
            <Card className="h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex items-center gap-3 p-4 border-b border-white/5">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.notes.noteTitle}
                    className="text-lg font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 h-auto"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPreview(!isPreview)}
                      className={cn(isPreview && 'bg-white/10')}
                    >
                      {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5 min-h-0">
                  <div className={cn('h-full', isPreview && 'hidden md:block')}>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={t.notes.writeMarkdown}
                      className="border-0 rounded-none bg-transparent h-full min-h-[400px] resize-none focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed"
                    />
                  </div>
                  <div className={cn('h-full overflow-auto', !isPreview && 'hidden md:block')}>
                    <ScrollArea className="h-full">
                      <div className="p-4 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {content || '*Start typing to see the preview...*'}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-lg font-medium text-white/60">{t.notes.selectNote}</p>
                <p className="text-sm text-white/40 mt-1">
                  {t.notes.selectHint}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
