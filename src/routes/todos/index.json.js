
import { api } from "./_api";

export const post = async (event) => {
  const body = await event.request.json();
  return api(event, {
    created_at: new Date(),
     // description: request.body.get("description"),
    description: body.description,
    user: body.user,
    completed: body.completed
  });
}