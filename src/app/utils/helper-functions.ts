export async function listFiles(dir: string) {
  try {
    const response = await fetch(`/api/list-files?dir=${dir}`);
    const data = await response.json();
    
    if (data.files) {
      console.log(`\n📁 Dizin: ${dir}`);
      console.log(`📊 Toplam dosya sayısı: ${data.count}`);
      console.log('\n📋 Dosya listesi:');
      
      data.files.forEach((file: any, index: number) => {
        const icon = file.isDirectory ? '📂' : '📄';
        console.log(`${(index + 1).toString().padStart(2, ' ')}. ${icon} ${file.name} ${file.type}`);
      });
      
      return data.files;
    }
    return [];
  } catch (error: any) {
    console.error(`❌ Hata: ${error.message}`);
    return [];
  }
}
