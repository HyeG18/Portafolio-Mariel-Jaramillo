export const assetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL;
  return `${base}${path}`.replace(/\/+/g, '/');
};
