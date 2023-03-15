import { atom } from "recoil";
///La liste des devices à utiliser au travers de la map
const user = atom({ key: "userState", default: undefined });
const tokenAtom = atom({ key: "token", default: undefined });

const settingsAtom = atom({ key: "settings", default: {} });

export { user, tokenAtom, settingsAtom };
