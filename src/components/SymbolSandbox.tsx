"use client";

import { useState } from "react";

interface SymbolItem {
  glyph: string;
  name: string;
  era: string;
  category: "axioms" | "celestial" | "logic" | "pointers" | "botanical";
  desc: string;
}

const HISTORICAL_SYMBOLS: SymbolItem[] = [
  // Axioms & Structure
  { glyph: "§", name: "Section Mark (Signum)", era: "Medieval–18th c.", category: "axioms", desc: "Introduces immutable fundamental laws in Spinoza's Ethics." },
  { glyph: "¶", name: "Pilcrow (Capitulum)", era: "Medieval–19th c.", category: "axioms", desc: "Originally drawn in red ink by scribes to mark a new branch of thought." },
  { glyph: "№", name: "Numero Sign", era: "19th c.", category: "axioms", desc: "Found on Victorian patent ledgers and laboratory registry logs." },
  { glyph: "†", name: "Dagger (Obelisk)", era: "Ancient–19th c.", category: "axioms", desc: "Used in classical scholarship for critical commentary and side notes." },
  { glyph: "‡", name: "Double Dagger (Diesis)", era: "17th–19th c.", category: "axioms", desc: "Secondary annotation mark for deeper layers of scholarship." },
  { glyph: "※", name: "Reference Mark", era: "18th c.", category: "axioms", desc: "Draws attention to a cross-reference or foundational source." },

  // Celestial & Navigation
  { glyph: "✦", name: "Stella Quadrata", era: "Renaissance", category: "celestial", desc: "Found on maritime compass roses to designate True North guide stars." },
  { glyph: "✧", name: "Open Star", era: "Renaissance", category: "celestial", desc: "Delicate unfilled celestial guide star." },
  { glyph: "⁂", name: "Asterism", era: "18th c.", category: "celestial", desc: "Three stars in a triangle used by printers to mark a silent, reflective pause." },
  { glyph: "⊛", name: "Circled Star", era: "18th c.", category: "celestial", desc: "Astronomical chart marker for a focal constellation or observatory point." },
  { glyph: "⚓", name: "Maritime Anchor", era: "18th–19th c.", category: "celestial", desc: "Symbol of harbor, deep grounding, and coastal navigation." },
  { glyph: "☼", name: "Sol (Sun of Clarity)", era: "Renaissance", category: "celestial", desc: "Classical alchemical emblem for daytime observation and clear intellect." },
  { glyph: "☽", name: "Luna (Crescent Moon)", era: "Renaissance", category: "celestial", desc: "Emblem for nighttime reflection, deep focus, and quiet synthesis." },
  { glyph: "🧭", name: "Compass Rose", era: "16th–19th c.", category: "celestial", desc: "Navigational instrument for charting paths across unknown domains." },

  // Logic & Primitives
  { glyph: "∴", name: "Therefore (Ergo)", era: "1659 (Rahn)", category: "logic", desc: "Declares a mathematical deduction: 'Therefore it follows that...'" },
  { glyph: "∵", name: "Because Sign", era: "18th c.", category: "logic", desc: "Introduces the underlying first-principle cause behind a premise." },
  { glyph: "∎", name: "Halmos Tombstone", era: "Classical Math", category: "logic", desc: "Signals Quod Erat Demonstrandum ('Which was to be demonstrated')." },
  { glyph: "⊕", name: "Sun Cross / Earth", era: "Renaissance Alchemy", category: "logic", desc: "Symbol for the physical Earth, bare-metal reality, and systems synthesis." },
  { glyph: "⊗", name: "Tensor / Composition", era: "18th c.", category: "logic", desc: "Represents algebraic composition and deep structural connection." },
  { glyph: "⌬", name: "Benzene / Hexagon", era: "19th c.", category: "logic", desc: "Symbol of structural symmetry and molecular composition." },
  { glyph: "⚙", name: "Mechanism Gear", era: "Industrial 19th c.", category: "logic", desc: "Emblem of engineered systems, clockwork, and reliable mechanisms." },

  // Pointers
  { glyph: "☞", name: "Manicule (Printer's Fist)", era: "15th–19th c.", category: "pointers", desc: "Latin for 'little hand'. Directs the reader's eye to important notes." },
  { glyph: "☛", name: "Solid Manicule", era: "18th–19th c.", category: "pointers", desc: "Heavy ink version used in Victorian newspapers and broadsides." },
  { glyph: "⟶", name: "Long Barbed Dart", era: "18th–19th c.", category: "pointers", desc: "Found on nautical charts and surveyors' journals for heading vectors." },
  { glyph: "⟼", name: "Vector with Tail", era: "19th c.", category: "pointers", desc: "Mathematical and navigational trajectory pointer." },
  { glyph: "⤳", name: "Wave Flow Dart", era: "17th–19th c.", category: "pointers", desc: "Denotes organic continuation or narrative flow across pages." },
  { glyph: "❧", name: "Hedera (Ivy Leaf)", era: "Roman to 18th c.", category: "pointers", desc: "Carved by Aldus Manutius to guide the reader to the next chapter." },

  // Botanical & Garden
  { glyph: "⚘", name: "Linnaean Seedling", era: "18th c. Herbals", category: "botanical", desc: "Used in botany field journals to designate a living, growing specimen." },
  { glyph: "❦", name: "Floral Heart Fleuron", era: "Renaissance", category: "botanical", desc: "A warm terminal flourish carved by Venetian type-cutters." },
  { glyph: "❀", name: "Printer's Rosette", era: "18th c.", category: "botanical", desc: "Classical headpiece ornament used on title pages of books." },
];

const HISTORICAL_PAIRS = [
  { label: "§ 1. / § 2.", s1: "§ 1.", s2: "§ 2.", desc: "Treatise Tenets" },
  { label: "✦ / ✦", s1: "✦", s2: "✦", desc: "Renaissance Stars" },
  { label: "🧭 / ⚙", s1: "🧭", s2: "⚙", desc: "Explorer / Engineer" },
  { label: "∴ / ∵", s1: "∴", s2: "∵", desc: "Therefore / Because" },
  { label: "❧ / ❧", s1: "❧", s2: "❧", desc: "Aldine Ivy Leaves" },
  { label: "№ 1. / № 2.", s1: "№ 1.", s2: "№ 2.", desc: "Victorian Ledger" },
  { label: "Clear", s1: "", s2: "", desc: "No Symbols" },
];

const INDENT_LEVELS = [
  { label: "0px (Flush)", px: 0 },
  { label: "12px", px: 12 },
  { label: "20px", px: 20 },
  { label: "32px", px: 32 },
  { label: "48px", px: 48 },
];

export default function SymbolSandbox() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SymbolItem["category"]>("axioms");
  const [target, setTarget] = useState<"both" | "s1" | "s2">("both");
  const [sym1, setSym1] = useState("");
  const [sym2, setSym2] = useState("");
  const [indent, setIndent] = useState(0);
  const [hasLine, setHasLine] = useState(false);
  const [selected, setSelected] = useState<SymbolItem>(HISTORICAL_SYMBOLS[0]);

  const filtered = HISTORICAL_SYMBOLS.filter((s) => s.category === activeTab);

  function applySymbol(glyph: string) {
    if (target === "both") {
      setSym1(glyph);
      setSym2(glyph);
      document.documentElement.style.setProperty("--symbol-bio-1", `"${glyph} "`);
      document.documentElement.style.setProperty("--symbol-bio-2", `"${glyph} "`);
    } else if (target === "s1") {
      setSym1(glyph);
      document.documentElement.style.setProperty("--symbol-bio-1", `"${glyph} "`);
    } else {
      setSym2(glyph);
      document.documentElement.style.setProperty("--symbol-bio-2", `"${glyph} "`);
    }
  }

  function applyPair(s1: string, s2: string) {
    setSym1(s1);
    setSym2(s2);
    if (s1) {
      document.documentElement.style.setProperty("--symbol-bio-1", `"${s1} "`);
    } else {
      document.documentElement.style.removeProperty("--symbol-bio-1");
    }
    if (s2) {
      document.documentElement.style.setProperty("--symbol-bio-2", `"${s2} "`);
    } else {
      document.documentElement.style.removeProperty("--symbol-bio-2");
    }
  }

  function applyIndent(px: number) {
    setIndent(px);
    document.documentElement.style.setProperty("--bio-indent", `${px}px`);
  }

  function toggleLine(enabled: boolean) {
    setHasLine(enabled);
    if (enabled) {
      document.documentElement.style.setProperty("--bio-line-width", "2px");
      document.documentElement.style.setProperty("--bio-line-padding", "16px");
    } else {
      document.documentElement.style.setProperty("--bio-line-width", "0px");
      document.documentElement.style.setProperty("--bio-line-padding", "0px");
    }
  }

  function handleReset() {
    setSym1("");
    setSym2("");
    setIndent(0);
    setHasLine(false);
    document.documentElement.style.removeProperty("--symbol-bio-1");
    document.documentElement.style.removeProperty("--symbol-bio-2");
    document.documentElement.style.removeProperty("--symbol-bio");
    document.documentElement.style.removeProperty("--bio-indent");
    document.documentElement.style.removeProperty("--bio-line-width");
    document.documentElement.style.removeProperty("--bio-line-padding");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded-sm shadow-2xl hover:opacity-90 cursor-pointer flex items-center gap-2 border border-stone-700"
        >
          <span>📜</span>
          <span className="font-mono font-medium">Bio Symbols & Indent</span>
        </button>
      ) : (
        <div className="w-96 max-h-[90vh] overflow-y-auto p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-sm border border-stone-300 dark:border-stone-700 shadow-2xl text-stone-900 dark:text-stone-100 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <div>
              <span className="font-semibold text-sm">Bio Layout & Symbol Tester</span>
              <p className="text-[11px] text-stone-500">Live preview indentation, lines & symbols</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>

          {/* Live Bio Preview Card */}
          <div className="p-3 bg-stone-100/80 dark:bg-stone-800/70 rounded-xs border border-stone-300 dark:border-stone-700 space-y-2 font-serif text-[13.5px] leading-snug">
            <div className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center justify-between">
              <span>Live Bio Preview</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400">● Live on page behind</span>
            </div>

            <div
              className="space-y-2 transition-all duration-200"
              style={{
                marginLeft: `${Math.min(indent, 32)}px`,
                borderLeftWidth: hasLine ? "2px" : "0px",
                borderLeftStyle: "solid",
                paddingLeft: hasLine ? "12px" : "0px",
                borderLeftColor: "currentColor",
              }}
            >
              <p>
                {sym1 && <span className="font-bold mr-1.5">{sym1}</span>}
                I like to understand things from first principles and find connections between fundamental ideas across different domains.
              </p>
              <p>
                {sym2 && <span className="font-bold mr-1.5">{sym2}</span>}
                I&apos;m a software engineer by profession, deeply interested in building reliable software systems.
              </p>
            </div>
          </div>

          {/* Indentation & Margin Controls */}
          <div className="space-y-1.5 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">
              <span>Indentation ({indent}px)</span>
              <span>Rule Line</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-5 gap-1 flex-1">
                {INDENT_LEVELS.map((lvl) => (
                  <button
                    key={lvl.px}
                    onClick={() => applyIndent(lvl.px)}
                    className={`py-1 text-center rounded-xs border font-mono text-[10px] cursor-pointer transition-all ${
                      indent === lvl.px
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold border-stone-900 dark:border-stone-100"
                        : "border-stone-200 dark:border-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {lvl.px === 0 ? "0px" : `${lvl.px}px`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => toggleLine(!hasLine)}
                className={`px-2 py-1 rounded-xs border font-mono text-[10px] cursor-pointer shrink-0 transition-all ${
                  hasLine
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold border-stone-900 dark:border-stone-100"
                    : "border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-400"
                }`}
              >
                {hasLine ? "Line: ON" : "Line: OFF"}
              </button>
            </div>
          </div>

          {/* Target Selector */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold mb-1">
              Symbol Target:
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "both", label: "Both Sentences" },
                { id: "s1", label: "Sentence 1 Only" },
                { id: "s2", label: "Sentence 2 Only" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTarget(opt.id as "both" | "s1" | "s2")}
                  className={`py-1 px-1 text-center rounded-xs border font-mono text-[10px] cursor-pointer transition-all ${
                    target === opt.id
                      ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold border-stone-900 dark:border-stone-100"
                      : "border-stone-200 dark:border-stone-700 hover:border-stone-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Historical Pairs */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold mb-1">
              Quick Historical Pairs:
            </div>
            <div className="flex flex-wrap gap-1">
              {HISTORICAL_PAIRS.map((pair) => (
                <button
                  key={pair.label}
                  onClick={() => applyPair(pair.s1, pair.s2)}
                  title={pair.desc}
                  className="px-2 py-0.5 border border-stone-200 dark:border-stone-700 rounded-xs text-[10px] font-mono hover:border-stone-400 cursor-pointer transition-all"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 border-b border-stone-200 dark:border-stone-800 pb-1.5 overflow-x-auto text-[10px]">
            {[
              { id: "axioms", label: "§ Axioms" },
              { id: "celestial", label: "✦ Celestial" },
              { id: "logic", label: "∴ Logic" },
              { id: "pointers", label: "☞ Pointers" },
              { id: "botanical", label: "⚘ Flora" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SymbolItem["category"])}
                className={`px-2 py-0.5 rounded-xs whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? "bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-semibold"
                    : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Symbol Click Tiles */}
          <div>
            <div className="grid grid-cols-7 gap-1">
              {filtered.map((item) => {
                const isSelected = selected.glyph === item.glyph;
                return (
                  <button
                    key={item.glyph}
                    onClick={() => {
                      setSelected(item);
                      applySymbol(item.glyph);
                    }}
                    title={`${item.name} (${item.era})`}
                    className={`h-9 flex items-center justify-center rounded-xs border text-base font-serif cursor-pointer transition-all ${
                      isSelected
                        ? "border-stone-900 dark:border-stone-100 bg-stone-900/10 dark:bg-stone-100/20 ring-1 ring-stone-900 dark:ring-stone-100 font-bold scale-105"
                        : "border-stone-200 dark:border-stone-700 hover:border-stone-400 hover:scale-102"
                    }`}
                  >
                    {item.glyph}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Symbol Detail */}
          <div className="p-2 bg-stone-50 dark:bg-stone-800/40 rounded-xs border border-stone-200 dark:border-stone-700 text-[11px] space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif">{selected.glyph}</span>
              <div>
                <span className="font-semibold leading-tight">{selected.name}</span>
                <span className="text-[10px] font-mono text-stone-500 ml-2">Era: {selected.era}</span>
              </div>
            </div>
            <p className="text-[10.5px] text-stone-600 dark:text-stone-300 leading-snug">
              {selected.desc}
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="w-full text-center py-1 text-[10px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer font-mono"
          >
            [Reset All Bio Layout & Symbols to Default]
          </button>
        </div>
      )}
    </div>
  );
}
