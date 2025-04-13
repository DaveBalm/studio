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
} from '@/firebase/firebase';

interface Note {
  id: string;
  content: string;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    const notesCollection = collection(db, 'notes');

    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const newNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
      }));
      setNotes(newNotes);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const results = notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(results);
  }, [searchTerm, notes]);

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteContent(event.target.value);
  };

  const handleAddNote = async () => {
    if (newNoteContent.trim() !== '') {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
      };
      try {
        const notesCollection = collection(db, 'notes');
        await setDoc(doc(notesCollection, newNote.id), {
          content: newNote.content,
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

        <div>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-md bg-secondary"
            >
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
