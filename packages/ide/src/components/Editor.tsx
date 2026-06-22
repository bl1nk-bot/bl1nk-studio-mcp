import { ChevronLeft, Clock, Eye, EyeOff, Split } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import type { Note } from "../store/notes";
import { EmojiPicker } from "./EmojiPicker";
import { MarkdownPreview } from "./MarkdownPreview";

interface EditorProps {
	note: Note | null;
	onChange: (id: string, content: string) => void;
	onEmojiChange?: (id: string, emoji: string) => void;
	onBack?: () => void;
}

type EditorMode = "edit" | "split" | "preview";

export function Editor({ note, onChange, onEmojiChange, onBack }: EditorProps) {
	const [mode, setMode] = useState<EditorMode>("split");
	const [localContent, setLocalContent] = useState("");
	const [emojiOpen, setEmojiOpen] = useState(false);
	const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
	const [isMobile, setIsMobile] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	useEffect(() => {
		if (note) setLocalContent(note.content);
	}, [note?.id]);

	function handleChange(val: string) {
		setLocalContent(val);
		if (saveTimeout.current) clearTimeout(saveTimeout.current);
		saveTimeout.current = setTimeout(() => {
			if (note) onChange(note.id, val);
		}, 400);
	}

	function handleTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Tab") {
			e.preventDefault();
			const ta = textareaRef.current!;
			const { selectionStart, selectionEnd } = ta;
			const next =
				localContent.slice(0, selectionStart) +
				"  " +
				localContent.slice(selectionEnd);
			setLocalContent(next);
			requestAnimationFrame(() => {
				ta.selectionStart = ta.selectionEnd = selectionStart + 2;
			});
		}
	}

	if (!note) {
		return (
			<div
				className="flex-1 flex items-center justify-center flex-col gap-3"
				style={{ background: "var(--bg-base)", color: "var(--text-muted)" }}
			>
				<div className="text-5xl opacity-20">✍</div>
				<p className="text-sm">Select a note or create a new one</p>
			</div>
		);
	}

	const modeButtons: { icon: React.ReactNode; m: EditorMode; label: string }[] =
		[
			{ icon: <Split size={12} />, m: "split", label: "Split" },
			{ icon: <EyeOff size={12} />, m: "edit", label: "Edit" },
			{ icon: <Eye size={12} />, m: "preview", label: "Preview" },
		];

	const showEdit =
		mode === "edit" ||
		(mode === "split" && (!isMobile || mobileTab === "edit"));
	const showPreview =
		mode === "preview" ||
		(mode === "split" && (!isMobile || mobileTab === "preview"));
	const isSplit = mode === "split" && !isMobile;

	return (
		<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
			{/* ── Toolbar ────────────────────────────────────────────── */}
			<div
				className="flex items-center justify-between px-4 border-b shrink-0 gap-2"
				style={{
					minHeight: 48,
					background: "var(--bg-elevated)",
					borderColor: "var(--border)",
					backdropFilter: "blur(20px)",
				}}
			>
				<div className="flex items-center gap-2 min-w-0">
					{onBack && (
						<button
							onClick={onBack}
							className="flex items-center justify-center rounded-md transition-all hover:bg-[rgba(0,188,212,0.1)] shrink-0"
							style={{ width: 36, height: 36, color: "var(--text-muted)" }}
						>
							<ChevronLeft size={16} />
						</button>
					)}

					<div className="relative shrink-0">
						<button
							onClick={() => onEmojiChange && setEmojiOpen((o) => !o)}
							className={cn(
								"flex items-center justify-center rounded-md transition-all",
								onEmojiChange
									? "hover:bg-[rgba(0,188,212,0.1)] cursor-pointer"
									: "cursor-default",
							)}
							style={{ width: 36, height: 36, fontSize: "1.25rem" }}
							title={onEmojiChange ? "Change emoji" : undefined}
						>
							{note.emoji ?? "📝"}
						</button>
						{emojiOpen && onEmojiChange && (
							<EmojiPicker
								onSelect={(emoji) => {
									onEmojiChange(note.id, emoji);
								}}
								onClose={() => setEmojiOpen(false)}
							/>
						)}
					</div>

					<span
						className="text-sm font-medium truncate"
						style={{ color: "var(--text-primary)" }}
					>
						{note.title}
					</span>

					{note.tags.map((t) => (
						<span
							key={t}
							className="hidden sm:inline text-xs px-1.5 py-0.5 rounded-full shrink-0"
							style={{
								background: "rgba(0,188,212,0.1)",
								color: "var(--teal)",
								border: "1px solid rgba(0,188,212,0.2)",
							}}
						>
							{t}
						</span>
					))}
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<span
						className="hidden sm:flex items-center gap-1 text-xs"
						style={{ color: "var(--text-muted)" }}
					>
						<Clock size={11} />
						{new Date(note.updatedAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>

					<div
						className="flex items-center rounded-md overflow-hidden"
						style={{ border: "1px solid var(--border)" }}
					>
						{modeButtons.map(({ icon, m, label }) => (
							<button
								key={m}
								title={label}
								onClick={() => setMode(m)}
								className={cn(
									"flex items-center gap-1 px-2.5 text-xs transition-all",
									mode === m
										? "text-[var(--teal)] bg-[rgba(0,188,212,0.12)]"
										: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.03)]",
								)}
								style={{ height: 36 }}
							>
								{icon}
								<span className="hidden sm:inline">{label}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ── Mobile tab switcher (only in split mode on mobile) ── */}
			{isMobile && mode === "split" && (
				<div
					className="flex shrink-0 border-b"
					style={{
						borderColor: "var(--border)",
						background: "var(--bg-elevated)",
					}}
				>
					{(["edit", "preview"] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setMobileTab(tab)}
							className="flex-1 py-2 text-sm font-medium capitalize transition-all"
							style={{
								color: mobileTab === tab ? "var(--teal)" : "var(--text-muted)",
								borderBottom:
									mobileTab === tab
										? "2px solid var(--teal)"
										: "2px solid transparent",
							}}
						>
							{tab === "edit" ? "Write" : "Preview"}
						</button>
					))}
				</div>
			)}

			{/* ── Panes ──────────────────────────────────────────────── */}
			<div className="flex flex-1 min-h-0 overflow-hidden">
				{showEdit && (
					<div
						className={cn(
							"flex flex-col overflow-hidden",
							isSplit ? "w-1/2 border-r" : "w-full",
						)}
						style={{ borderColor: "var(--border)" }}
					>
						<textarea
							ref={textareaRef}
							value={localContent}
							onChange={(e) => handleChange(e.target.value)}
							onKeyDown={handleTab}
							spellCheck={false}
							className="flex-1 resize-none outline-none editor-font leading-relaxed"
							style={{
								padding: "clamp(1rem, 4vw, 2rem)",
								fontSize: "clamp(15px, 2.5vw, 14px)",
								background: "transparent",
								color: "var(--text-primary)",
								caretColor: "var(--teal)",
							}}
							placeholder="Start writing in Markdown…"
						/>
					</div>
				)}

				{showPreview && (
					<div
						className={cn(
							"flex flex-col overflow-hidden",
							isSplit ? "w-1/2" : "w-full",
						)}
						style={{ background: "rgba(5, 15, 15, 0.5)" }}
					>
						<MarkdownPreview content={localContent} />
					</div>
				)}
			</div>
		</div>
	);
}
