export const GUMMYGUM_AVATAR_BASE_URL = "https://gummygum.app/avatars";
export const AVATAR_IDS = Array.from({ length: 26 }, (_, i) => `av-${i + 1}`);
export const avatarUrl = (id?: string) => `${GUMMYGUM_AVATAR_BASE_URL}/${id && AVATAR_IDS.includes(id) ? id : "av-1"}.svg`;
