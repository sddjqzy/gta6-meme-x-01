// gta6-meme-x-01 入口：只做一件事，把仓库根目录里的 POST.json 交到评判方读取的位置。
//
// 流程很简单：POST.json 里写着那条已发到 X 上的 GTA 6 梗帖的地址，
// 评判方会按地址去 X 上取帖子的首图和正文来打分，
// 所以本程序不需要对帖子本身做任何加工，只负责把这份地址文件原样送过去。
// 程序跑在 Node 22 上，除了标准库什么也不依赖。
//
// 在评判容器之外调试时，可以用环境变量把输入输出目录换成本地路径，例如：
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// 输入目录：默认是评判容器里的 /bot，本地调试时通过环境变量改成仓库根目录。
const sourceDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
// 输出目录：默认是评判容器里的 /output，本地调试时通过环境变量改成任意目录。
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourceFile = join(sourceDir, "POST.json");
const targetFile = join(targetDir, "POST.json");

// 输出目录可能还不存在，先把它连同父目录一起建出来，免得复制时因缺目录而失败。
// recursive: true 让已存在的目录也不会报错，重复运行同样安全。
mkdirSync(targetDir, { recursive: true });

try {
  copyFileSync(sourceFile, targetFile);
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`无法把 POST.json 从 ${sourceDir} 复制出来：${reason}`);
  process.exit(1);
}
