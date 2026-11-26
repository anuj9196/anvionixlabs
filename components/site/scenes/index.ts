import type { Scene } from "./kit";
import { sketch } from "./sketch";
import { mobile } from "./mobile";
import { commits } from "./commits";
import { blocks } from "./blocks";
import { deploy } from "./deploy";
import { devices } from "./devices";
import { consult } from "./consult";
import { sheet } from "./sheet";

export { W, H } from "./kit";
/** In play order; the first is also the still frame. */
export const SCENES: Scene[] = [sketch, mobile, commits, blocks, deploy, devices, consult, sheet];
