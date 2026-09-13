import { describe, expect, it } from "vitest";
import { TypeIsNotDefined } from "../../src/exceptions/domain/url-regex";
import {
	compiledUrlPattern,
	extractParamsNames,
	hasTypeParams,
	normalizePath,
} from "../../src/helpers/url-regex";

describe("compiledUrlPattern", () => {
	it("should compile numbers", () => {
		const url = "/hello/<int:id>/<int:ido>";
		const regex = compiledUrlPattern(url);
		expect(regex.test("/hello/1/1")).toBeTruthy();
	});

	it("should compile strings", () => {
		const url = "/hello/<string:id>/<string:ido>";
		const regex = compiledUrlPattern(url);
		expect(regex.test("/hello/abc/def")).toBeTruthy();
	});

	it("should compile boleans", () => {
		const url = "/hello/<boolean:id>/<boolean:ido>";
		const regex = compiledUrlPattern(url);
		expect(regex.test("/hello/false/false")).toBeTruthy();
	});

	it("should compile slugs", () => {
		const url = "/hello/<slug:id>/<slug:ido>";
		const regex = compiledUrlPattern(url);
		expect(regex.test("/hello/abc/def")).toBeTruthy();
	});

	it("creates named groups for multiple parameters", () => {
		const regex = compiledUrlPattern("/users/<int:userId>/posts/<int:postId>");
		const match = regex.exec("/users/10/posts/25");

		expect(match?.groups).toMatchObject({
			userId: "10",
			postId: "25",
		});
	});

	it("anchors the pattern to the complete path", () => {
		const regex = compiledUrlPattern("/users/<int:id>");

		expect(regex.test("/users/42")).toBe(true);
		expect(regex.test("/prefix/users/42")).toBe(false);
		expect(regex.test("/users/42/suffix")).toBe(false);
	});

	it("throws when a parameter type is not defined", () => {
		expect(() => compiledUrlPattern("/users/<unknown:id>")).toThrow(
			TypeIsNotDefined,
		);
	});
});

describe("hasTypeParams", () => {
	it("detects typed parameters", () => {
		expect(hasTypeParams("/users/<int:id>")).toBe(true);
	});

	it("returns false for static paths", () => {
		expect(hasTypeParams("/users/42")).toBe(false);
	});
});

describe("extractParamsNames", () => {
	it("extracts parameter names in path order", () => {
		expect(
			extractParamsNames("/users/<int:userId>/posts/<int:postId>"),
		).toEqual(["userId", "postId"]);
	});

	it("throws when the path has no typed parameters", () => {
		expect(() => extractParamsNames("/users/static")).toThrow(
			"No parameter matches found",
		);
	});
});

describe("normalizePath", () => {
	it("adds a leading slash", () => {
		expect(normalizePath("users")).toBe("/users");
	});

	it("preserves an existing leading slash", () => {
		expect(normalizePath("/users")).toBe("/users");
	});

	it("collapses repeated slashes", () => {
		expect(normalizePath("///users//42")).toBe("/users/42");
	});
});
