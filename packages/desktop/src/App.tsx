import { useState } from "react";

type View = "editor" | "graph" | "timeline" | "insights";

// packages/desktop/src/App.test.tsx
import { render, screen } from "`@testing-library/react`";
import userEvent from "`@testing-library/user-event`";
import App from "./App.js";

describe("App view navigation", () => {
	it("shows editor by default", () => {
		render(<App />);
		expect(screen.getByRole("heading", { name: "Characters" })).toBeInTheDocument();
	});

	it("switches views from nav buttons", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("button", { name: "Graph" }));
		expect(screen.getByText("Graph View")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Timeline" }));
		expect(screen.getByText("Timeline View")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Insights" }));
		expect(screen.getByRole("heading", { name: "Insights" })).toBeInTheDocument();
	});
});
