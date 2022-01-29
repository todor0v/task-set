
import { api } from "./_api";

export const get = (event) => {
  if (event.request.headers.get('cookie')?.includes('authenticated=true')) return api(event);
  return {
    headers: { Location: '/' },
    status: 308
  }
}