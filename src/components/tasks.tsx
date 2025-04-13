'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';
import {Checkbox} from '@/components/ui/checkbox';

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
    // Load tasks from local storage or a database
    const initialTasks = [
      {id: '1', title: 'Sample task 1', completed: false},
      {id: '2', title: 'Sample task 2', completed: true},
      {id: '3', title: 'Another task to do', completed: false},
    ];
    setTasks(initialTasks);
  }, []);

  useEffect(() => {
    // Filter tasks based on search term
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

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleTaskComplete = (id: string, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? {...task, completed: completed} : task
      )
    );
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
