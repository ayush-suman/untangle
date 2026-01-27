import { store } from "$lib/store.js";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
    const tags: Array<string> = [];
    for (const data of store) {
        tags.push(data.tag)
    }
    return json({
        ok: true,
        tags
    });
}