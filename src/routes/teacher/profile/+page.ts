import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const userInfo = await parent();
	return { ...userInfo.user };
};
