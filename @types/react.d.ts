import type { HTMLAttributes } from "react";

declare module "react" {
	interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
		/** @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory */
		webkitdirectory?: "true" | "false";
	}
}
