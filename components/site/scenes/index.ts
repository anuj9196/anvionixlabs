import type { Scene } from "./kit";
import { sketch } from "./sketch";
import { commits } from "./commits";
import { blocks } from "./blocks";
import { deploy } from "./deploy";
import { sheet } from "./sheet";

export { W, H } from "./kit";
/** In play order; the first is also the still frame. */
export const SCENES: Scene[] = [sketch, commits, blocks, deploy, sheet];
