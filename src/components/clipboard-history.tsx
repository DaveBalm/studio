'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';

export function ClipboardHistory() {
  const [clipboardData, setClipboardData] = useState<string[]>([]);

  useEffect(() => {
    // Placeholder for actual clipboard reading logic
    // This would ideally use the Clipboard API or a similar mechanism
    const initialData = [
      'Copied text 1',
      'https://example.com',
      'Another copied item',
    ];
    setClipboardData(initialData);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optionally, provide user feedback
    alert('Copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clipboard History</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {clipboardData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-md bg-secondary"
          >
            <p className="text-sm truncate">{item}</p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(item)}
            >
              <Icons.copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
