import { api } from "./_api";

export const del = (event) => {
  return api(event);
}

export const patch = async (event) => {
  const body = await event.request.json();
  return api(event, {
    // description: body.description,
    // user: body.user,
    completed: body.completed,
    id: body.id
  });
}