"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "system"; text: string };

type ClearSignal = { readonly clear: true };
const CLEAR: ClearSignal = { clear: true };

type CommandOutput = string | ClearSignal;
type CommandHandler = (args: string[]) => CommandOutput;

declare global {
  interface WindowEventMap {
    "terminal:run": CustomEvent<{ cmd: string }>;
  }
}

export default function Terminal() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "system", text: "type `help` to see available commands" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Record<string, CommandHandler>>(
    () => ({
      help: () =>
        [
          "available commands:",
          "  help            show this help",
          "  about           short bio",
          "  contact         contact info",
          "  echo <text>     print text",
          "  date            current date/time",
          "  clear           clear the terminal",
        ].join("\n"),
      about: () => "  laura chen — programmer, boba enjoyer, cat lover.",
      work: () =>
        [
          "  figma            software engineer intern | summer 2026",
          "  notion           software engineer intern | winter 2026",
          "  aws              software engineer intern | summer 2025",
        ].join("\n"),
      contact: () =>
        "  email: laura@example.com\n  github: github.com/laurachen\n  linkedin: linkedin.com/in/laurachen",
      echo: (args) => args.join(" "),
      date: () => new Date().toString(),
      clear: () => CLEAR,
    }),
    []
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [messages.length]);

  const focusInput = () => inputRef.current?.focus();

  const run = (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    setHistory((h) => [line, ...h]);
    setHistIdx(null);

    // save only the command text (no "> ")
    setMessages((m) => [...m, { role: "user", text: line }]);

    const [cmd, ...args] = line.split(/\s+/);
    const fn: CommandHandler | undefined = commands[cmd];

    const greetings = ["hi", "hey", "hello", "yo", "sup", "hiya", "heya"];
    if (greetings.includes(cmd.toLowerCase())) {
      setMessages((m) => [
        ...m,
        { role: "system", text: "  hii! it's nice to meet you :)" },
      ]);
      return;
    }

    if (!fn) {
      setMessages((m) => [
        ...m,
        { role: "system", text: `unknown command: ${cmd}` },
      ]);
      return;
    }

    const out = fn(args);
    if (typeof out === "string") {
      setMessages((m) => [...m, { role: "system", text: out }]);
    } else if (out.clear) {
      setMessages([]);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      setInput("");
      run(val);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const nextIdx =
        histIdx === null ? 0 : Math.min(histIdx + 1, history.length - 1);
      setHistIdx(nextIdx);
      setInput(history[nextIdx]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const nextIdx = histIdx - 1;
      if (nextIdx < 0) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  useEffect(() => {
    const handler = (e: WindowEventMap["terminal:run"]) => {
      const cmd = e.detail?.cmd ?? "";
      if (cmd) {
        setInput("");
        run(cmd);
        focusInput();
      }
    };
    window.addEventListener("terminal:run", handler);
    return () => window.removeEventListener("terminal:run", handler);
  }, [run]);

  return (
    <div className="terminal-wrap" onClick={focusInput}>
      <div ref={scrollRef} className="terminal">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="line user">
              <span className="prompt">&gt;</span>
              <span className="cmd">{m.text}</span>
            </div>
          ) : (
            <pre key={i} className="line sys">
              {m.text}
            </pre>
          )
        )}

        {/* live prompt */}
        <div className="prompt-row">
          <span className="prompt">&gt;</span>
          <input
            ref={inputRef}
            className="prompt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}
