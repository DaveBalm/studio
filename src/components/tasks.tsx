'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';
import {Checkbox} from '@/components/ui/checkbox';
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from '@/firebase/firebase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const tasksCollection = collection(db, 'tasks');

    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const newTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        completed: doc.data().completed,
      }));
      setTasks(newTasks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const results = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchTerm, tasks]);

  const handleTaskTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTaskTitle(event.target.value);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== '') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
      };
      try {
        const tasksCollection = collection(db, 'tasks');
        await setDoc(doc(tasksCollection, newTask.id), {
          title: newTask.title,
          completed: newTask.completed,
        });
        setNewTaskTitle('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskComplete = async (id: string, completed: boolean) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      await setDoc(doc(tasksCollection, id), {
        title: tasks.find((task) => task.id === id)!.title,
        completed: completed,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskTitle}
            onChange={handleTaskTitleChange}
            placeholder="Enter task title"
          />
          <Button onClick={handleAddTask}>Add Task</Button>
        </div>

        <Input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
        />


        <div>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-md bg-secondary"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    handleTaskComplete(task.id, checked === true)
                  }
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </label>
              </div>
              <Button variant="ghost" size="icon">
                <Icons.edit className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
