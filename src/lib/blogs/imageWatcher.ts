import { Editor } from '@tiptap/core';

export function getImageUrls(editor: Editor): string[] {
  const urls: string[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'image' && node.attrs.src) {
      urls.push(node.attrs.src);
    }
  });
  return urls;
}

export function watchImageDeletion(
  editor: Editor,
  deleteFileFromApi: (url: string) => Promise<void>,
  setError: (error: string | null) => void,
  debounceDelay: number = 500
) {
  const previousImages = { current: getImageUrls(editor) };

  const handleUpdate = debounce(({ editor }: { editor: Editor }) => {
    const currentImages = getImageUrls(editor);
    const deletedImages = previousImages.current.filter(
      (url) => !currentImages.includes(url)
    );

    deletedImages.forEach(async (url) => {
      try {
        await deleteFileFromApi(url);
        console.log(`Deleted image from backend: ${url}`);
      } catch (err) {
        setError(`Failed to delete image: ${url}`);
        console.error('Delete error:', err);
      }
    });

    previousImages.current = currentImages;
  }, debounceDelay);

  editor.on('update', handleUpdate);
  editor.on('create', () => {
    previousImages.current = getImageUrls(editor);
  });

  return () => {
    editor.off('update', handleUpdate);
    editor.off('create');
  };
}


function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export async function deleteFileFromApi(url: string): Promise<void> {
  await fetch('/api/crud/files/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}