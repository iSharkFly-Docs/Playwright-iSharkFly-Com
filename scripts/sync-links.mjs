// 将 LINKS.md 的内容同步到 README.md 中 <!-- LINKS:START --> 与 <!-- LINKS:END --> 之间。
// LINKS.md 是唯一数据源，README.md 中的这一段不要手动修改。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = join(root, 'README.md');
const linksPath = join(root, 'LINKS.md');

const START = '<!-- LINKS:START -->';
const END = '<!-- LINKS:END -->';

const readme = readFileSync(readmePath, 'utf8');
const links = readFileSync(linksPath, 'utf8')
  .replace(/\r\n/g, '\n')
  .trim()
  // 标题整体降一级，使其嵌套在 README 的「## 相关链接」之下
  .replace(/^(#{1,5}) /gm, '#$1 ');

const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);
if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  console.error(`README.md 中缺少 ${START} / ${END} 标记`);
  process.exit(1);
}

const block = `${START}\n<!-- 本段由 scripts/sync-links.mjs 根据 LINKS.md 自动生成，请勿手动修改 -->\n\n${links}\n\n${END}`;
const next = readme.slice(0, startIdx) + block + readme.slice(endIdx + END.length);

if (next === readme) {
  console.log('README.md 已是最新');
} else {
  writeFileSync(readmePath, next);
  console.log('已将 LINKS.md 同步到 README.md');
}
