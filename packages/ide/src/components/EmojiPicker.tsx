import React, { useEffect, useRef, useState } from "react";

const EMOJI_CATEGORIES = [
	{
		name: "Common",
		emojis: [
			"📝",
			"📌",
			"🎯",
			"💡",
			"🔥",
			"⭐",
			"✅",
			"❌",
			"⚠️",
			"📎",
			"🔗",
			"💬",
			"🏷️",
			"📅",
			"📊",
			"📈",
			"🔍",
			"🔑",
			"💎",
			"🏆",
			"🚀",
			"⚡",
			"🌟",
			"✨",
		],
	},
	{
		name: "Faces",
		emojis: [
			"😀",
			"😊",
			"🤔",
			"😎",
			"🥳",
			"🤩",
			"😅",
			"🙏",
			"👋",
			"💪",
			"🎉",
			"👍",
			"🤝",
			"👏",
			"🧠",
			"👀",
			"🫡",
			"🌈",
			"💫",
		],
	},
	{
		name: "Work",
		emojis: [
			"💼",
			"🖥️",
			"📁",
			"🗂️",
			"📋",
			"📦",
			"🔧",
			"⚙️",
			"🔒",
			"🛡️",
			"🌐",
			"💻",
			"🖊️",
			"📐",
			"📏",
			"🗒️",
			"🏗️",
			"🔬",
			"📡",
			"🧰",
		],
	},
	{
		name: "Nature",
		emojis: [
			"🌿",
			"🌸",
			"🌊",
			"🔮",
			"🌙",
			"☀️",
			"🌈",
			"🍀",
			"🌻",
			"🌺",
			"🍂",
			"❄️",
			"🌍",
			"🦋",
			"🌅",
			"🍃",
			"🌱",
			"⛅",
			"🌾",
		],
	},
	{
		name: "Creative",
		emojis: [
			"🎨",
			"🎵",
			"🎬",
			"📸",
			"✏️",
			"🎭",
			"🎪",
			"🎲",
			"🧩",
			"🎸",
			"🎹",
			"🎤",
			"🖌️",
			"🎠",
			"🎡",
			"🎢",
			"🎻",
			"🥁",
			"🎺",
		],
	},
	{
		name: "Objects",
		emojis: [
			"🏠",
			"🚗",
			"✈️",
			"⏰",
			"📱",
			"🕯️",
			"🔭",
			"🧪",
			"💊",
			"🧬",
			"🗺️",
			"🧭",
			"🔦",
			"🪄",
			"🧲",
			"🧸",
			"🎁",
			"🏺",
			"🪬",
		],
	},
];

interface EmojiPickerProps {
	onSelect: (emoji: string) => void;
	onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState(0);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handle(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		}
		document.addEventListener("mousedown", handle);
		return () => document.removeEventListener("mousedown", handle);
	}, [onClose]);

	const displayed = query
		? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((e) => e.includes(query))
		: EMOJI_CATEGORIES[category].emojis;

	return (
		<div
			ref={ref}
			className="absolute z-50 rounded-xl shadow-2xl overflow-hidden"
			style={{
				background: "var(--bg-elevated)",
				border: "1px solid var(--border-strong)",
				backdropFilter: "blur(24px)",
				width: 272,
				top: "calc(100% + 6px)",
				left: 0,
			}}
		>
			<div className="px-3 pt-3 pb-2">
				<input
					autoFocus
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search emojis…"
					className="w-full rounded-lg px-2.5 py-1.5 text-xs outline-none"
					style={{
						background: "rgba(0,188,212,0.07)",
						border: "1px solid var(--border)",
						color: "var(--text-primary)",
					}}
				/>
			</div>

			{!query && (
				<div className="flex gap-0.5 px-2 pb-2 overflow-x-auto">
					{EMOJI_CATEGORIES.map((cat, i) => (
						<button
							key={cat.name}
							onClick={() => setCategory(i)}
							className="shrink-0 px-2 py-0.5 rounded-md text-xs transition-all"
							style={{
								background:
									category === i ? "rgba(0,188,212,0.15)" : "transparent",
								color: category === i ? "var(--teal)" : "var(--text-muted)",
							}}
						>
							{cat.name}
						</button>
					))}
				</div>
			)}

			<div
				className="px-3 pb-3 grid gap-0.5"
				style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
			>
				{displayed.slice(0, 40).map((emoji, i) => (
					<button
						key={i}
						onClick={() => {
							onSelect(emoji);
							onClose();
						}}
						className="flex items-center justify-center w-7 h-7 rounded-md text-lg hover:bg-[rgba(0,188,212,0.12)] transition-all"
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	);
}
