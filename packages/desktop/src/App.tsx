import { useState } from "react";

type View = "editor" | "graph" | "timeline" | "insights";

export default function App() {
	const [activeView, setActiveView] = useState<View>("editor");

	return (
		<div>
			<h1>Visual Story Planner</h1>
			<nav>
				<button type="button" onClick={() => setActiveView("editor")}>
					Editor
				</button>
				<button type="button" onClick={() => setActiveView("graph")}>
					Graph
				</button>
				<button type="button" onClick={() => setActiveView("timeline")}>
					Timeline
				</button>
				<button type="button" onClick={() => setActiveView("insights")}>
					Insights
				</button>
			</nav>
			<main>
				{activeView === "editor" && (
					<div>
						<h2>Characters</h2>
					</div>
				)}
				{activeView === "graph" && <div>Graph View</div>}
				{activeView === "timeline" && <div>Timeline View</div>}
				{activeView === "insights" && (
					<div>
						<h2>Insights</h2>
					</div>
				)}
			</main>
		</div>
	);
}
