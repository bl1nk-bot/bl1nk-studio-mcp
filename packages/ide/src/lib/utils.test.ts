import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
	it("returns a single class unchanged", () => {
		expect(cn("foo")).toBe("foo");
	});

	it("merges multiple classes", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("handles conditional classes (truthy)", () => {
		expect(cn("base", true && "extra")).toBe("base extra");
	});

	it("omits falsy classes", () => {
		expect(cn("base", false && "extra")).toBe("base");
	});

	it("deduplicates conflicting Tailwind classes", () => {
		const result = cn("px-2", "px-4");
		expect(result).toBe("px-4");
	});

	it("returns empty string for no inputs", () => {
		expect(cn()).toBe("");
	});
});
