'use client';

import {ClipboardHistory} from '@/components/clipboard-history';
import {Notes} from '@/components/notes';
import {SidebarProvider} from '@/components/ui/sidebar';
import {SidebarDemo} from '@/components/sidebar-demo';
import {Tasks} from '@/components/tasks';
import {Toaster} from '@/components/ui/toaster';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarDemo />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold">NoteFlow</h1>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-1">
              <ClipboardHistory />
            </div>
            <div className="col-span-1">
              <Notes />
            </div>
            <div className="col-span-1">
              <Tasks />
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

