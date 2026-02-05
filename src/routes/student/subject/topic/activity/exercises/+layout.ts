import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { activityLocalstore } from '$lib/store/activity_student';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const _items = activityLocalstore.get();
    const items = _items === null ? (JSON.parse(data.activity.items) ? JSON.parse(data.activity.items) : []) : _items;

    if (items.length === 0) { 
      activityLocalstore.set([]) 
    } else {
      activityLocalstore.set(JSON.parse(data.activity.items));
    }

    delete data.activity.items;
    data.activity = data.activity.activity;

    return {
      info: data,
      items,
    };
  }
};
