import { atom } from "jotai";
import { NameId } from "@/types";

export const meAtom = atom<NameId | null>(null);
