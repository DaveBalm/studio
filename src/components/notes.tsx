'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  subscribeWithRetry,
} from '@/firebase/firebase';
import { Icons } from './icons';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Note {
  id: string;
  content: string;
  tags?: string[];
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const notesCollection = collection(db, 'notes');

    try {
          const unsubscribe = subscribeWithRetry(
            notesCollection,
            (snapshot) => {
              const newNotes = snapshot.docs.map((doc) => ({
                id: doc.id,
                content: doc.data().content,
                tags: doc.data().tags || [],
              }));
              setNotes(newNotes);
                        // Extract all unique tags from notes
                        const allTags = newNotes.reduce((acc: string[], note: Note) => {
                            if (note.tags) {
                                note.tags.forEach(tag => {
                                    if (!acc.includes(tag)) {
                                        acc.push(tag);
                                    }
                                });
                            }
                            return acc;
                        }, []);
                        setAvailableTags(allTags);
            },
            (error) => {
              console.error('Error listening to notes:', error);
            }
          );
    } catch (error) {
      console.error('Error listening to notes:', error);
    }
  }, []);

  useEffect(() => {
    const results = notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTags.length === 0 || note.tags?.some(tag => selectedTags.includes(tag)))
    );
    setFilteredNotes(results);
  }, [searchTerm, notes, selectedTags]);

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteContent(event.target.value);
  };

  const handleAddNote = async () => {
    if (newNoteContent.trim() !== '') {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
        tags: [],
      };
      try {
        const notesCollection = collection(db, 'notes');
        await setDoc(doc(notesCollection, newNote.id), {
          content: newNote.content,
          tags: [],
        });
        setNewNoteContent('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                return prevTags.filter(t => t !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Textarea
            value={newNoteContent}
            onChange={handleNoteChange}
            placeholder="Enter your note here..."
          />
          <Button onClick={handleAddNote}>Add Note</Button>
        </div>

         <Input
            type="search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearch}
        />

                <div className="flex gap-2">
                    {availableTags.map((tag) => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "primary" : "secondary"}
                            onClick={() => toggleTag(tag)}
                            className="cursor-pointer"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

        <ScrollArea className="h-[200px] w-full rounded-md border">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-md hover:bg-accent"
            >
              <p className="text-sm">{note.content}</p>
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {note.tags.map(tag => (
                                        <Badge key={tag}>{tag}</Badge>
                                    ))}
                                </div>
                            )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
