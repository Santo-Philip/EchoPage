import { supabase } from '@/lib/supabase';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`/upload/${file.name}`, arrayBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (error) {
        console.log(error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    const {data: publicUrl} = supabase.storage.from('images').getPublicUrl(data.path);
    return new Response(JSON.stringify({ message: 'File uploaded', url: publicUrl.publicUrl }), {
      status: 200,
    });
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
};
