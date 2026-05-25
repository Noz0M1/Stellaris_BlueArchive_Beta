#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const INDENT = " ".repeat(4);
const INLINE_BLOCK_HEADS = new Set(["rgb", "hsv", "hsv360"]);

function usage() {
    console.error("Usage: node .asset/tools/pdx-format.mjs [--check] <file> [file ...]");
    process.exit(2);
}

function tokenize(input) {
    const tokens = [];
    let i = 0;

    while (i < input.length) {
        const ch = input[i];

        if (ch === "\r" || ch === "\n") {
            if (ch === "\r" && input[i + 1] === "\n") i += 1;
            tokens.push({ type: "newline", value: "\n" });
            i += 1;
            continue;
        }

        if (/\s/.test(ch)) {
            i += 1;
            continue;
        }

        if (ch === "#") {
            const start = i;
            while (i < input.length && input[i] !== "\n" && input[i] !== "\r") i += 1;
            tokens.push({ type: "comment", value: input.slice(start, i).trimEnd() });
            continue;
        }

        if (ch === '"') {
            const start = i;
            i += 1;
            while (i < input.length) {
                if (input[i] === "\\" && i + 1 < input.length) {
                    i += 2;
                    continue;
                }
                if (input[i] === '"') {
                    i += 1;
                    break;
                }
                i += 1;
            }
            tokens.push({ type: "atom", value: input.slice(start, i) });
            continue;
        }

        if ((ch === "<" || ch === ">" || ch === "!") && input[i + 1] === "=") {
            tokens.push({ type: "atom", value: input.slice(i, i + 2) });
            i += 2;
            continue;
        }

        if ("{}=".includes(ch)) {
            tokens.push({ type: ch, value: ch });
            i += 1;
            continue;
        }

        const start = i;
        while (
            i < input.length &&
            !/\s/.test(input[i]) &&
            !["{", "}", "=", "#", '"'].includes(input[i])
        ) {
            i += 1;
        }
        tokens.push({ type: "atom", value: input.slice(start, i) });
    }

    return tokens;
}

function findMatchingBrace(tokens, openIndex) {
    let depth = 0;
    for (let i = openIndex; i < tokens.length; i += 1) {
        if (tokens[i].type === "{") depth += 1;
        if (tokens[i].type === "}") depth -= 1;
        if (depth === 0) return i;
    }
    return -1;
}

function canInlineBlock(tokens, openIndex) {
    const closeIndex = findMatchingBrace(tokens, openIndex);
    if (closeIndex < 0) return false;

    for (let i = openIndex + 1; i < closeIndex; i += 1) {
        if (tokens[i].type === "{" || tokens[i].type === "}" || tokens[i].type === "=") return false;
        if (tokens[i].type === "comment") return false;
    }

    return closeIndex > openIndex + 1 && closeIndex - openIndex <= 8;
}

function inlineBlockText(tokens, openIndex) {
    const closeIndex = findMatchingBrace(tokens, openIndex);
    const body = tokens
        .slice(openIndex + 1, closeIndex)
        .map((token) => token.value)
        .join(" ");
    return { text: `{ ${body} }`, closeIndex };
}

function mergeSplitComparisonOperators(tokens) {
    const merged = [];

    for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];

        if (token.type === "atom" && ["<", ">", "!"].includes(token.value)) {
            let j = i + 1;
            while (tokens[j]?.type === "newline") j += 1;

            if (tokens[j]?.type === "=") {
                merged.push({ type: "atom", value: `${token.value}=` });
                i = j;
                continue;
            }
        }

        merged.push(token);
    }

    return merged;
}

function isComparisonOperator(token) {
    return token?.type === "atom" && /^(?:[<>]=?|!=|==)$/.test(token.value);
}

function format(input) {
    const tokens = mergeSplitComparisonOperators(tokenize(input));
    const lines = [];
    let line = "";
    let indent = 0;
    let last = "";

    function flush() {
        const trimmed = line.trimEnd();
        if (trimmed.length > 0) lines.push(trimmed);
        line = "";
        last = "";
    }

    function append(text, mode = "atom") {
        if (line.length === 0) {
            line = INDENT.repeat(Math.max(indent, 0)) + text;
        } else if (mode === "equals") {
            line = line.trimEnd() + " = ";
        } else if (mode === "brace") {
            line = line.trimEnd() + " " + text;
        } else if (last === "=" || last === "{") {
            line += text;
        } else {
            line += " " + text;
        }
        last = mode === "equals" ? "=" : text;
    }

    for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];

        if (
            token.type === "atom" &&
            INLINE_BLOCK_HEADS.has(token.value) &&
            tokens[i + 1]?.type === "{" &&
            canInlineBlock(tokens, i + 1)
        ) {
            const inline = inlineBlockText(tokens, i + 1);
            append(`${token.value} ${inline.text}`);
            i = inline.closeIndex;
            continue;
        }

        if (token.type === "comment") {
            if (line.length === 0) {
                line = INDENT.repeat(Math.max(indent, 0)) + token.value;
            } else {
                line = line.trimEnd() + " " + token.value;
            }
            flush();
            continue;
        }

        if (token.type === "newline") {
            if (isComparisonOperator(tokens[i - 1]) || isComparisonOperator(tokens[i + 1])) {
                continue;
            }
            flush();
            continue;
        }

        if (token.type === "=") {
            append("=", "equals");
            continue;
        }

        if (token.type === "{") {
            append("{", "brace");
            flush();
            indent += 1;
            continue;
        }

        if (token.type === "}") {
            flush();
            indent -= 1;
            line = INDENT.repeat(Math.max(indent, 0)) + "}";
            flush();
            continue;
        }

        append(token.value);

        const next = tokens[i + 1];
        if (
            next &&
            next.type !== "=" &&
            next.type !== "{" &&
            next.type !== "}" &&
            next.type !== "comment" &&
            next.type !== "newline" &&
            !isComparisonOperator(token) &&
            !isComparisonOperator(next)
        ) {
            flush();
        }
    }

    flush();
    return lines.join("\n") + "\n";
}

const args = process.argv.slice(2);
const check = args[0] === "--check";
const files = check ? args.slice(1) : args;

if (files.length === 0) usage();

let changed = false;
for (const file of files) {
    const path = resolve(file);
    const original = readFileSync(path, "utf8");
    const formatted = format(original);

    if (formatted !== original) {
        changed = true;
        if (check) {
            console.log(path);
        } else {
            writeFileSync(path, formatted, "utf8");
            console.log(`formatted ${path}`);
        }
    }
}

if (check && changed) process.exit(1);
