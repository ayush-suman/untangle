import { store } from "$lib/store";
import { json } from "@sveltejs/kit";

export async function GET({ url, request, params }) {
    const tag = url.searchParams.get("tag");
    const sessionID = params.session_id;

    let session = store.find((s) => s.id === sessionID);
    if (!session) {
        return json({
            ok: false,
            error: `Session with id ${sessionID} not found`
        }, {
            status: 404
        })
    }

    if (tag) {
        return json({
            ok: true,
            id: session.id,
            name: session.name,
            messages: session.tags.filter((t) => t.tag === tag)
        }, {
            status: 200
        });
    } else {
        return json({
            ok: true,
            id: session.id,
            name: session.name,
            messages: session.tags
        }, {
            status: 200
        });
    }
}