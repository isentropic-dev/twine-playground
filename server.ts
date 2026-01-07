import { bundle } from 'jsr:@deno/emit@0.46.0';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ts': 'application/javascript',
  '.json': 'application/json',
};

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'application/octet-stream';
}

async function serveFile(path: string): Promise<Response> {
  try {
    const absolutePath = new URL(path, import.meta.url).href;

    if (path.endsWith('.ts')) {
      const result = await bundle(absolutePath);
      return new Response(result.code, {
        headers: {
          'content-type': 'application/javascript',
        },
      });
    }

    const file = await Deno.readFile(path);
    return new Response(file, {
      headers: {
        'content-type': getMimeType(path),
      },
    });
  } catch (error) {
    console.error('Error serving file:', path, error);
    return new Response('Not Found', { status: 404 });
  }
}

Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url);
  let path = url.pathname;

  if (path === '/') {
    path = '/index.html';
  }

  const filePath = `.${path}`;

  return await serveFile(filePath);
});

console.log('Server running at http://localhost:8000');
