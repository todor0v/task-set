import { api } from "./_api";

export const del = async (event) => {
  if (event.request.headers.get('cookie') !== null && event.request.headers.get('cookie').includes('authenticated=true')) return api(event)
  return {
    headers: { Location: '/' },
    status: 308
  }
}

export const patch = async (event) => {
  const body = await event.request.json();
  if (event.request.headers.get('cookie') !== null && event.request.headers.get('cookie').includes('authenticated=true')) return api(event, {
    // description: body.description,
    // user: body.user,
    completed: body.completed,
    id: body.id
  });
  return {
    headers: { Location: '/' },
    status: 308
  }
}