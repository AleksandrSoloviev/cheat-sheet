#!/usr/bin/env python3
"""One-off migration of the existing study files into Astro content."""

import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

from docx import Document

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "content"

VUE_SLUGS = [
    "ref-vs-reactive",
    "value-unwrap",
    "computed",
    "watch",
    "props",
    "emit",
    "v-model",
    "reactivity-loss",
    "watch-props",
    "composable",
    "pinia",
    "route-params",
    "v-if-v-show-v-for",
    "script-setup",
    "provide-inject",
    "fetch",
    "abort-controller",
    "lifecycle",
    "shallow-ref",
    "slots",
]

JS_SLUGS = [
    "event-loop",
    "promise-async",
    "this-bind",
    "closure",
    "prototypes",
    "solid",
    "singleton",
    "factory-di",
    "observer",
    "http-rest",
    "cors-cookies",
    "browser-render",
    "storage",
    "typescript",
    "a11y",
    "display",
    "position",
    "nesting-traps",
    "stacking-context",
    "z-index",
    "bfc",
]

CONSPECT_SLUGS = [
    ("1. Реактивность", "reactivity", "Reactivity"),
    ("2. Composition API / script setup", "composition-api", "Composition API / script setup"),
    ("3. Компоненты, props, emits, v-model", "components", "Components, props, emits, v-model"),
    ("4. Template: директивы, слоты, attrs", "template", "Template: directives, slots, attrs"),
    ("5. Lifecycle", "lifecycle", "Lifecycle"),
    ("6. Composables", "composables", "Composables"),
    ("7. Pinia / состояние", "pinia", "Pinia / state"),
    ("8. Vue Router", "router", "Vue Router"),
    ("9. Performance", "performance", "Performance"),
    ("10. TypeScript", "typescript", "TypeScript"),
    ("11. Nuxt 3", "nuxt", "Nuxt 3"),
    ("12. Тесты и tooling", "testing", "Tests and tooling"),
    ("13. Vue 2 → 3 / legacy", "vue2-to-vue3", "Vue 2 → 3 / legacy"),
    ("14. Vue vs React (сравнительные)", "vue-vs-react", "Vue vs React"),
    ("15. Архитектура и поведенческие", "architecture", "Architecture and behavioral questions"),
    ("Шпаргалка «если забыл формулировку»", "phrase-sheet", "If you forget the wording"),
    ("Режим экзамена (4 дня)", "exam-mode", "Exam mode (4 days)"),
]


def yaml_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_card(locale: str, technology: str, slug: str, order: int, title: str, body: str) -> None:
    path = CONTENT / "cards" / locale / technology / f"{slug}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "\n".join(
            [
                "---",
                f"order: {order}",
                f"title: {yaml_quote(title)}",
                f"technology: {technology}",
                "---",
                "",
                body.strip(),
                "",
            ]
        ),
        encoding="utf-8",
    )


def card_body(text: str) -> tuple[str, str]:
    lines = [line.rstrip() for line in text.splitlines() if line.strip()]
    title = lines[0]
    bullets = []
    for line in lines[1:]:
        cleaned = line[1:].strip() if line.startswith("•") else line.strip()
        bullets.append(f"- {cleaned}")
    return title, "\n".join(bullets)


def read_docx_cards(filename: str) -> list[str]:
    document = Document(ROOT / filename)
    seen: list[str] = []
    known = set()
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                text = cell.text.strip()
                if text and text not in known:
                    known.add(text)
                    seen.append(text)
    return seen


class MarkdownParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.skip = 0
        self.capture_code = False
        self.code: list[str] = []
        self.in_cell = False
        self.row: list[str] = []
        self.rows: list[list[str]] = []
        self.in_table = False
        self.cell: list[str] = []
        self.href = ""
        self.list_stack: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs_map = dict(attrs)
        if tag in {"script", "style"}:
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "pre":
            self.capture_code = True
            self.code = []
        elif tag == "h2":
            self.parts.append("\n## ")
        elif tag == "h3":
            self.parts.append("\n### ")
        elif tag == "h4":
            self.parts.append("\n#### ")
        elif tag == "p":
            self.parts.append("\n\n")
        elif tag == "li":
            self.parts.append("\n- ")
        elif tag == "br":
            self.parts.append("\n")
        elif tag == "strong" or tag == "b":
            self.parts.append("**")
        elif tag == "code" and not self.capture_code:
            self.parts.append("`")
        elif tag == "table":
            self.in_table = True
            self.rows = []
        elif tag == "tr" and self.in_table:
            self.row = []
        elif tag in {"td", "th"} and self.in_table:
            self.in_cell = True
            self.cell = []
        elif tag == "a":
            self.href = attrs_map.get("href", "")

    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.skip:
            self.skip -= 1
            return
        if self.skip:
            return
        if tag == "pre" and self.capture_code:
            code = html.unescape("".join(self.code)).strip("\n")
            self.parts.append(f"\n\n```\n{code}\n```\n")
            self.capture_code = False
        elif tag in {"h2", "h3", "h4"}:
            self.parts.append("\n")
        elif tag in {"strong", "b"}:
            self.parts.append("**")
        elif tag == "code" and not self.capture_code:
            self.parts.append("`")
        elif tag in {"td", "th"} and self.in_cell:
            self.row.append(re.sub(r"\s+", " ", "".join(self.cell)).strip())
            self.in_cell = False
        elif tag == "tr" and self.in_table:
            if self.row:
                self.rows.append(self.row)
        elif tag == "table" and self.in_table:
            if self.rows:
                width = max(len(row) for row in self.rows)
                lines = []
                for index, row in enumerate(self.rows):
                    padded = row + [""] * (width - len(row))
                    lines.append("| " + " | ".join(padded) + " |")
                    if index == 0:
                        lines.append("| " + " | ".join(["---"] * width) + " |")
                self.parts.append("\n\n" + "\n".join(lines) + "\n")
            self.in_table = False
        elif tag == "a" and self.href.startswith("#"):
            self.href = ""

    def handle_data(self, data):
        if self.skip:
            return
        if self.capture_code:
            self.code.append(data)
            return
        if self.in_cell:
            self.cell.append(data)
            return
        if data.strip() or self.parts:
            self.parts.append(data)

    def markdown(self) -> str:
        text = html.unescape("".join(self.parts))
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip() + "\n"


def html_to_markdown(fragment: str) -> str:
    parser = MarkdownParser()
    parser.feed(fragment)
    return parser.markdown()


def write_conspect() -> None:
    text = (ROOT / "VUE3-EXAM-QA.md").read_text(encoding="utf-8")
    chunks = re.split(r"(?m)^## ", text)
    sections = {}
    for chunk in chunks[1:]:
        title, _, body = chunk.partition("\n")
        sections[title.strip()] = body.strip()
    for order, (source_title, slug, en_title) in enumerate(CONSPECT_SLUGS, start=1):
        body = sections[source_title]
        for locale, title in (("ru", source_title),):
            path = CONTENT / "conspect" / locale / "vue" / f"{slug}.md"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(
                "\n".join(["---", f"order: {order}", f"title: {yaml_quote(title)}", "technology: vue", "---", "", body, ""]),
                encoding="utf-8",
            )
        # English file is written by translate_conspect()
        (CONTENT / "conspect" / "en" / "vue").mkdir(parents=True, exist_ok=True)
        meta = CONTENT / "conspect" / "en" / "vue" / f"{slug}.title"
        meta.write_text(en_title, encoding="utf-8")


def panel_blocks(raw: str) -> dict[str, str]:
    markers = list(re.finditer(r'<section class="day-panel" data-panel="([^"]+)"', raw))
    blocks = {}
    for index, marker in enumerate(markers):
        start = marker.end()
        end = markers[index + 1].start() if index + 1 < len(markers) else len(raw)
        blocks[marker.group(1)] = raw[start:end]
    return blocks


def extract_roadmap() -> None:
    raw = (ROOT / "roadmap.html").read_text(encoding="utf-8")
    panels = panel_blocks(raw)
    days = {}
    for day in ("day1", "day2", "day3", "optional"):
        block = panels.get(day, "")
        heading = re.search(r"<h2>(.*?)</h2>", block, re.S)
        title = re.sub(r"<[^>]+>", "", heading.group(1)).strip() if heading else day
        questions = []
        for question in re.finditer(r'<details class="q".*?</details>', block, re.S):
            piece = question.group(0)
            qid = re.search(r'data-id="([^"]+)"', piece).group(1)
            qtitle = re.search(r'<span class="qtitle">(.*?)</span>', piece, re.S).group(1)
            qtitle = re.sub(r"<[^>]+>", "", qtitle)
            qtitle = html.unescape(qtitle).strip()
            body_match = re.search(r'<div class="q-body">(.*)</div>\s*</details>', piece, re.S)
            body = html_to_markdown(body_match.group(1) if body_match else "")
            questions.append({"id": qid, "title": qtitle, "body": body})
        days[day] = {"title": title, "questions": questions}

    glossary = panels["glossary"]
    terms = re.search(r'data-gloss-sub="terms">(.*)data-gloss-sub="lifecycle"', glossary, re.S).group(1)
    lifecycle = re.search(r'data-gloss-sub="lifecycle" hidden>(.*)</div>\s*</section>', glossary, re.S).group(1)
    terms_md = html_to_markdown(terms)
    lifecycle_md = html_to_markdown(lifecycle)
    write_roadmap("ru", days, terms_md, lifecycle_md)
    (ROOT / "scripts" / "roadmap-ru.json").write_text(
        json.dumps({"days": days, "terms": terms_md, "lifecycle": lifecycle_md}, ensure_ascii=False),
        encoding="utf-8",
    )


def write_roadmap(locale: str, days: dict, terms: str, lifecycle: str) -> None:
    titles = {
        "day1": days["day1"]["title"],
        "day2": days["day2"]["title"],
        "day3": days["day3"]["title"],
        "optional": days["optional"]["title"],
        "glossary-terms": "Термины" if locale == "ru" else "Terms",
        "glossary-lifecycle": "Жизненный цикл" if locale == "ru" else "Lifecycle",
    }
    for day, payload in days.items():
        path = CONTENT / "roadmap" / locale / "vue" / f"{day}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        lines = ["---", f"day: {day}", f"title: {yaml_quote(payload['title'])}", "questions:"]
        for question in payload["questions"]:
            lines.append(f"  - id: {yaml_quote(question['id'])}")
            lines.append(f"    title: {yaml_quote(question['title'])}")
            lines.append(f"    body: {yaml_quote(question['body'])}")
        lines.extend(["---", ""])
        path.write_text("\n".join(lines), encoding="utf-8")
    for name, body in (("glossary-terms", terms), ("glossary-lifecycle", lifecycle)):
        path = CONTENT / "roadmap" / locale / "vue" / f"{name}.md"
        path.write_text(
            "\n".join(
                [
                    "---",
                    f"day: {name}",
                    f"title: {yaml_quote(titles[name])}",
                    "questions: []",
                    "---",
                    "",
                    body.strip(),
                    "",
                ]
            ),
            encoding="utf-8",
        )


def main() -> None:
    vue_cards = read_docx_cards("Vue-cheatsheet-cards.docx")
    js_cards = read_docx_cards("JS-Frontend-cheatsheet-cards.docx")
    if len(vue_cards) != len(VUE_SLUGS) or len(js_cards) != len(JS_SLUGS):
        raise SystemExit(f"card count mismatch vue={len(vue_cards)} js={len(js_cards)}")
    for order, (slug, text) in enumerate(zip(VUE_SLUGS, vue_cards), start=1):
        title, body = card_body(text)
        write_card("ru", "vue", slug, order, title, body)
    for order, (slug, text) in enumerate(zip(JS_SLUGS, js_cards), start=1):
        title, body = card_body(text)
        write_card("ru", "javascript", slug, order, title, body)
    write_conspect()
    extract_roadmap()
    print("ru content written")


if __name__ == "__main__":
    main()
