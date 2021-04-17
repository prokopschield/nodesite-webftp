import { ConfigField } from "doge-config";
export default function fileIndex(path: string, files: {
    [index: string]: string | ConfigField;
}): string;
