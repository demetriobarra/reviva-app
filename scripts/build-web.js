// Copia os arquivos do site (raiz do repositório) para www/, que o Capacitor empacota no app.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'www');
const files = ['index.html', 'native.js', 'plantas.js', 'conteudo.js', 'livro.js', 'relatos.json', 'manifest.json', 'privacidade.html', 'suporte.html', 'termos.html',
  'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-192.svg', 'icon-512.png', 'icon-512.svg'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const f of files) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const f of fs.readdirSync(path.join(root, 'fonts'))) fs.copyFileSync(path.join(root, 'fonts', f), path.join(out, 'fonts', f));
for (const dir of ['livro', 'day']) { const d = path.join(root, dir); if (fs.existsSync(d)) { fs.mkdirSync(path.join(out, dir), { recursive: true }); for (const f of fs.readdirSync(d)) fs.copyFileSync(path.join(d, f), path.join(out, dir, f)); } }
const livro = path.join(root, 'livro');
console.log('www pronto:', fs.readdirSync(out).length, 'itens');
