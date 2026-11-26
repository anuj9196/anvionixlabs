import type { Scene } from "./kit";
import { sketch } from "./sketch";
import { mobile } from "./mobile";
import { commits } from "./commits";
import { blocks } from "./blocks";
import { deploy } from "./deploy";
import { devices } from "./devices";
import { consult } from "./consult";
import { sheet } from "./sheet";
import { slip } from "./slip";
import { book } from "./book";
import { terminal } from "./terminal";
import { servers } from "./servers";
import { network } from "./network";
import { trophy } from "./trophy";
import { notebook } from "./notebook";

export { W, H } from "./kit";

/** Every scene by id, so server components can name one without passing functions to the client. */
export const SCENE_BY_ID = { sketch, mobile, commits, blocks, deploy, devices, consult, sheet, slip, book, terminal, servers, network, trophy, notebook };
export type SceneId = keyof typeof SCENE_BY_ID;

/** The home hero, in play order; the first is also the still frame. */
export const HERO_SCENES: SceneId[] = ["sketch", "mobile", "commits", "blocks", "deploy", "devices", "consult", "sheet"];
export type { Scene };
