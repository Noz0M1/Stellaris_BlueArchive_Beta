# PDX Formatter

这是一个给 Stellaris/Paradox Script 的简单格式化脚本。它可以把普通代码块展开成多行，方便看清层级：

```paradox
values = {
    foo = bar
}
```

短颜色块会保持单行，例如 `rgb { 142 188 241 }`。

## 在中文 IntelliJ IDEA 里配置一键格式化

### 0. 先确认 Node.js 路径

这个脚本需要用 Node.js 运行。先打开系统终端，执行：

```sh
which node
```

如果输出类似下面这样的路径，后面 `程序` 一栏就填这个路径：

```sh
/usr/local/bin/node
```

常见路径：

- Apple Silicon Mac + Homebrew: `/opt/homebrew/bin/node`
- Intel Mac + Homebrew: `/usr/local/bin/node`
- Windows: 通常类似 `C:\Program Files\nodejs\node.exe`

如果 `which node` 没有输出，先安装 Node.js，然后重启 IDEA。

### 1. 打开外部工具设置

1. 打开 IDEA。
2. 进入设置。
   - macOS：顶部菜单 `IntelliJ IDEA -> 设置...`
   - Windows/Linux：顶部菜单 `文件 -> 设置...`
3. 在左侧找到 `工具 -> 外部工具`。
4. 点击右侧的 `+`，新增一个外部工具。

### 2. 填写外部工具信息

建议这样填写：

- 名称: `PDX Format Current File`
- 组: `PDX`
- 描述: `格式化当前 Paradox Script 文件`
- 程序: 填 `which node` 查到的 Node.js 完整路径，例如 `/opt/homebrew/bin/node`
- 实参/参数: `"$ProjectFileDir$/.asset/tools/pdx-format.mjs" "$FilePath$"`
- 工作目录: `$ProjectFileDir$`

如果界面里有这些选项，建议这样设置：

- 勾选 `执行后同步文件`
- 勾选 `在主菜单中显示`
- 勾选 `在编辑器菜单中显示`
- 勾选 `在项目视图中显示`
- 可以勾选 `打开工具输出控制台`，方便第一次确认有没有报错

填完后点击 `确定`，回到设置窗口后再点击 `应用` 或 `确定`。

注意：`程序` 不建议只填 `node`。JetBrains 官方文档要求外部工具的程序路径尽量使用绝对路径；而且 macOS 上从图形界面启动的 IDEA 经常找不到终端里的 `PATH`。`实参/参数` 里的两个路径都要带双引号，因为项目路径里可能有空格。

### 3. 手动运行一次

先不要急着绑定快捷键，建议先手动运行一次：

1. 在 IDEA 里打开一个要格式化的 `.txt` 文件。
2. 顶部菜单进入 `工具 -> 外部工具 -> PDX -> PDX Format Current File`。
3. 点击后，当前文件会被格式化。
4. 如果没有变化，可能是这个文件本来已经符合规则。

如果顶部菜单里找不到：

- 回到 `设置 -> 工具 -> 外部工具`，确认 `PDX Format Current File` 前面的复选框是勾选状态。
- 确认刚才点过 `应用` 或 `确定`。
- 也可以在项目文件树里右键当前 `.txt` 文件，找 `外部工具 -> PDX -> PDX Format Current File`。
- 还可以按 `Shift` 两次，搜索 `PDX Format Current File`。

### 4. 给工具绑定快捷键

1. 进入设置。
   - macOS：顶部菜单 `IntelliJ IDEA -> 设置...`
   - Windows/Linux：顶部菜单 `文件 -> 设置...`
2. 打开 `键盘映射`。
3. 在搜索框里搜索 `PDX Format Current File`。
4. 如果搜不到，手动展开 `外部工具 -> PDX -> PDX Format Current File`。
   - 有些版本也可能在 `主菜单 -> 工具 -> 外部工具 -> PDX -> PDX Format Current File` 下面。
5. 右键这个工具，选择 `添加键盘快捷键`。
6. 按下你想用的快捷键，例如 `Option + Command + L` 或其他没有冲突的组合。
7. 点击 `确定` 保存。

之后打开任意 Paradox Script 的 `.txt` 文件，按这个快捷键，就会格式化当前文件。

如果 IDEA 提示快捷键冲突，换一个组合即可。不要覆盖自己常用的 `重新格式化代码` 快捷键，避免和 IDEA 自带格式化器混在一起。

### 5. 其他运行方式

如果暂时不想绑定快捷键，也可以这样运行：

1. 打开要格式化的 `.txt` 文件。
2. 顶部菜单：`工具 -> 外部工具 -> PDX -> PDX Format Current File`。

或者：

1. 在左侧项目文件树里右键一个 `.txt` 文件。
2. 选择 `外部工具 -> PDX -> PDX Format Current File`。

或者：

1. 按 `Shift` 两次打开搜索。
2. 输入 `PDX Format Current File`。
3. 回车运行。

## 命令行用法

格式化一个文件：

```sh
node .asset/tools/pdx-format.mjs common/example.txt
```

格式化多个文件：

```sh
node .asset/tools/pdx-format.mjs common/example.txt events/example.txt
```

只检查文件是否需要格式化，不写入修改：

```sh
node .asset/tools/pdx-format.mjs --check common/example.txt
```

如果 `--check` 输出了文件路径，表示这些文件格式化后会发生变化。

## 当前格式化规则

- 使用 4 个空格缩进。
- `=` 左右会统一保留一个空格。
- 普通 `{ ... }` 代码块会展开成多行。
- 同一个花括号里的多个列表项或多条条件会分别放到单独的行。
- 右花括号 `}` 会单独放在一行。
- 不会拆分普通比较表达式，例如 `num_ascension_perks > 1`、`value >= 10` 会保持一行。
- 如果旧版脚本已经把比较表达式拆成多行，或把 `>=` 拆成 `> =`，重新运行新版脚本会尝试修复。
- `rgb { 142 188 241 }`、`hsv { ... }`、`hsv360 { ... }` 这类短颜色块会保持单行。
- 字符串里的内容不会被拆开。
- `#` 注释会保留。

## 注意事项

- 这个脚本只会修改你传给它的文件，不会自动扫描整个 mod。
- 第一次对大文件使用前，建议先用 Git 确认当前文件没有重要的未保存改动。
- 如果格式化结果不符合预期，可以在 Git 里撤销这个文件的修改，再调整脚本规则。
- 不建议把这个工具直接用于 `localisation` 目录下的 `.yml` 文件。

## 找不到菜单或快捷键时怎么排查

1. 先确认外部工具已经保存：`设置 -> 工具 -> 外部工具` 里能看到 `PDX -> PDX Format Current File`。
2. 确认工具名前面的复选框是勾选的。未勾选时，工具会保留在设置里，但不显示在菜单中。
3. 确认已经点击 `应用` 或 `确定`。
4. 打开一个实际文件后再试。`$FilePath$` 需要当前编辑器里有文件。
5. 如果运行时报 `No such file or directory`，检查 `程序` 是否填写了 Node.js 的完整路径。
6. 如果运行后文件没刷新，确认外部工具选项里勾选了 `执行后同步文件`。
