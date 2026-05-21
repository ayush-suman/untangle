import { store } from "$lib/store.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const body = await request.json();
    const sessionID = body.id;
    const sessionName = body.name;
    const sessionDescription = body.description;
    let session = store.find((s) => s.id === sessionID)
    if (!session) {
        store.push({
            id: sessionID,
            name: sessionName,
            description: sessionDescription,
            tags: []
        })
        return json({
            ok: true,
            message: "Session named successfuly"
        }, {
            status: 201
        })
    } else {
        session.name = sessionName;
        session.description = sessionDescription;
        return json({
            ok: true,
            message: "Session named successfuly"
        }, {
            status: 200
        })
    }
}

export async function GET({ request }) {
    return json({
        ok: true,
        sessions: store.map((s) => { return {
            id: s.id,
            name: s.name,
            description: s.description,
            tags: s.tags.map((t) => t.tag)
        }})
    }, {
        status: 200
    })
}