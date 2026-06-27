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
  PenTool,
  Code,
  List,
  Heading
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';
import type { Note } from '@/types';

interface FolderSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  folders: string[];
  notes: Note[];
  selectedFolder: string | null;
  setSelectedFolder: (f: string | null) => void;
  filteredNotes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
}

const FolderSidebar = ({ 
  searchQuery, setSearchQuery, folders, notes, selectedFolder, setSelectedFolder, filteredNotes, selectedNoteId, setSelectedNoteId 
}: FolderSidebarProps) => {
  const { t } = useLanguage();
  return (
    <Card className="h-full flex flex-col bg-black/40 backdrop-blur-xl border-white/5">
      <CardContent className="p-3 space-y-3 flex flex-col h-full">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-amber-400 transition-colors" />
          <Input
            placeholder={t.notes.searchNotes}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus-visible:ring-amber-500/30 transition-all"
          />
        </div>

        <ScrollArea className="flex-1 -mx-3 px-3">
          <div className="space-y-1 mb-4">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFolder(null)}
              className={cn(
                'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                !selectedFolder ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <FileText className="w-4 h-4" />
              {t.notes.allNotes}
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-black/40 text-white/80 border-white/10">
                {notes.length}
              </Badge>
            </motion.button>
            {folders.map((folder: string) => {
              const count = notes.filter((n) => n.folder === folder).length;
              const isSelected = selectedFolder === folder;
              return (
                <motion.button
                  key={folder}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFolder(folder)}
                  className={cn(
                    'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  <Folder className={cn("w-4 h-4", isSelected ? "fill-amber-500/20" : "")} />
                  {folder}
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 bg-black/40 text-white/80 border-white/10">
                    {count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-white/30 uppercase tracking-wider px-3 mb-2">Notes</div>
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.button
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    'w-full text-left rounded-xl px-4 py-3 transition-all duration-300 group relative overflow-hidden',
                    selectedNoteId === note.id
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'hover:bg-white/5 border-transparent hover:border-white/10'
                  )}
                  style={{ borderWidth: '1px' }}
                >
                  {selectedNoteId === note.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-45deg]"
                      animate={{ left: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  <p className={cn("text-sm font-medium truncate relative z-10", selectedNoteId === note.id ? "text-amber-100" : "text-white")}>
                    {note.title || t.notes.untitled}
                  </p>
                  <div className="flex items-center gap-2 mt-2 relative z-10">
                    <span className="text-[10px] text-white/40 flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-md border border-white/5">
                      <Clock className="w-3 h-3" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-5 border-white/10", selectedNoteId === note.id ? "bg-amber-500/20 border-amber-500/30 text-amber-300" : "bg-white/5")}>
                      {note.folder}
                    </Badge>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {filteredNotes.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/30 text-center py-8">
                {searchQuery ? t.notes.noMatch : t.notes.noNotes}
              </motion.p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface PremiumToolbarProps {
  isPreview: boolean;
  setIsPreview: (v: boolean) => void;
  insertFormatting: (before: string, after: string) => void;
}

const PremiumToolbar = ({ isPreview, setIsPreview, insertFormatting }: PremiumToolbarProps) => {
  return (
    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white" onClick={() => insertFormatting('**', '**')} title="Bold">
        <PenTool className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white" onClick={() => insertFormatting('### ', '')} title="Heading">
        <Heading className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white" onClick={() => insertFormatting('- ', '')} title="List">
        <List className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white" onClick={() => insertFormatting('```\n', '\n```')} title="Code">
        <Code className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPreview(!isPreview)}
        className={cn("h-7 w-7", isPreview ? 'bg-amber-500/20 text-amber-400' : 'text-white/60 hover:text-white')}
        title={isPreview ? "Edit" : "Preview"}
      >
        {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </Button>
    </div>
  );
};

interface NoteEditorProps {
  selectedNote: Note | undefined;
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  isPreview: boolean;
  setIsPreview: (v: boolean) => void;
  handleDelete: () => void;
}

const NoteEditor = ({ selectedNote, title, setTitle, content, setContent, isPreview, setIsPreview, handleDelete }: NoteEditorProps) => {
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  if (!selectedNote) {
    return (
      <Card className="h-full flex items-center justify-center bg-black/40 backdrop-blur-xl border-white/5">
        <CardContent className="text-center py-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
          >
            <FileText className="w-8 h-8 text-white/20" />
          </motion.div>
          <p className="text-lg font-medium text-white/60">{t.notes.selectNote}</p>
          <p className="text-sm text-white/40 mt-2 max-w-[250px] mx-auto text-balance">
            {t.notes.selectHint}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-black/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-white/5 bg-white/[0.02]">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.notes.noteTitle}
            className="text-xl sm:text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 h-auto text-white placeholder:text-white/20"
          />
          <div className="flex items-center gap-2 shrink-0">
            <PremiumToolbar isPreview={isPreview} setIsPreview={setIsPreview} insertFormatting={insertFormatting} />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors rounded-lg"
              onClick={handleDelete}
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 min-h-0 relative">
          <div className={cn('h-full bg-[#0a0a0a]', isPreview && 'hidden md:block')}>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.notes.writeMarkdown}
              className="border-0 rounded-none bg-transparent h-full min-h-[400px] resize-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed text-amber-50/80 placeholder:text-white/20"
              style={{ lineHeight: '1.7' }}
            />
          </div>
          <div className={cn('h-full overflow-hidden bg-[#050505]', !isPreview && 'hidden md:block')}>
            <ScrollArea className="h-full w-full">
              <div className="p-8 prose prose-invert prose-amber max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-a:text-amber-400 prose-headings:text-amber-100 prose-strong:text-amber-200">
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
  );
};

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
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedNote, setTitle, setContent]);

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId, setSelectedNoteId]);

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

  const Actions = (
    <>
      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-colors">
            <FolderPlus className="w-4 h-4 text-amber-200" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{t.notes.newFolder}</DialogTitle>
            <DialogDescription className="text-white/60">Create a new folder to organize your notes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder={t.notes.folderName}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10">{t.common.cancel}</Button>
              </DialogClose>
              <Button onClick={handleAddFolder} className="bg-amber-600 hover:bg-amber-500 text-white">{t.common.create}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 border-0 transition-all">
            <Plus className="w-4 h-4" />
            {t.notes.newNote}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{t.notes.newNote}</DialogTitle>
            <DialogDescription className="text-white/60">Create a new markdown note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder={t.notes.noteTitle}
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10">{t.common.cancel}</Button>
              </DialogClose>
              <Button onClick={handleCreateNote} className="bg-amber-600 hover:bg-amber-500 text-white">{t.common.create}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <PageWrapper
      icon={StickyNote}
      title={t.nav.notes}
      subtitle={t.notes.subtitle}
      badgeText="Markdown"
      colorScheme="amber"
      actions={Actions}
    >
      <div className="h-[calc(100vh-16rem)] min-h-[600px] grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1 h-full"
        >
          <FolderSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            folders={folders}
            notes={notes}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            filteredNotes={filteredNotes}
            selectedNoteId={selectedNoteId}
            setSelectedNoteId={setSelectedNoteId}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-3 h-full"
        >
          <NoteEditor 
            selectedNote={selectedNote}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            isPreview={isPreview}
            setIsPreview={setIsPreview}
            handleDelete={handleDelete}
          />
        </motion.div>
      </div>
    </PageWrapper>
  );
}
