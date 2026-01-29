import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dir = searchParams.get('dir');

  if (!dir) {
    return NextResponse.json({ error: 'Directory parameter is required' }, { status: 400 });
  }

  try {
    // Security: Ensure the directory is within the project root
    const projectRoot = process.cwd();
    const targetDir = path.resolve(projectRoot, dir);
    
    if (!targetDir.startsWith(projectRoot)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const files = fs.readdirSync(targetDir);
    const fileList = files.map((file) => {
      const fullPath = path.join(targetDir, file);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      return {
        name: file,
        isDirectory,
        type: isDirectory ? '(klasör)' : '(dosya)'
      };
    });

    return NextResponse.json({
      directory: dir,
      count: files.length,
      files: fileList
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
