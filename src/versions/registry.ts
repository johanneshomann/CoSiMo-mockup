import type { AppVersion } from "../types";
import v1 from "./v1";

/**
 * All app design iterations, newest last.
 * Add a version: create `versions/vN/` then add one line here.
 */
export const versions: AppVersion[] = [v1];

export const defaultVersionId = versions[0].id;
