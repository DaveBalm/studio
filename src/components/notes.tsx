'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';

interface Note {
  id: string;
  content: string;
  tags: string[];
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Load notes from local storage or a database
    const initialNotes = [
      {id: '1', content: 'Sample note 1. This is a very important note', tags: ['example', 'note', 'important']},
      {id: '2', content: 'Sample note 2 with some sample data', tags: ['sample', 'data']},
      {id: '3', content: 'A quick note about react components', tags: ['react', 'components']},
    ];
    setNotes(initialNotes);
  }, []);

  useEffect(() => {
    // Filter notes based on search term
    const results = notes.filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredNotes(results);
  }, [searchTerm, notes]);

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNoteContent(event.target.value);
  };

  const handleAddNote = () => {
    if (newNoteContent.trim() !== '') {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
        tags: [],
      };
      setNotes([...notes, newNote]);
      setNewNoteContent('');
    }
  };

  const handleTagClick = (tag: string) => {
    // Implement tag selection logic here
    alert(`Tag "${tag}" clicked! Implement tag selection.`);
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
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleTagClick(tag)} // Added onClick handler
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
