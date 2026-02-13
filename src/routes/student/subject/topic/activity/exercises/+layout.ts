import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { activityLocalstore } from '$lib/store/activity_student';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const _items = activityLocalstore.get();
    if (_items === null) {
      const _items = JSON.parse(data.activity.items);
      delete data.activity.items;
      activityLocalstore.set(_items, data.activity);
      return {
        info: data,
        items: _items,
      };
    } else {
      delete data.activity.items;
      return {
        info: data,
        items: _items,
      };
    }
    /*
    const _items = activityLocalstore.get();
    const items = _items === null ? (JSON.parse(data.activity.items) ? JSON.parse(data.activity.items) : []) : _items;
    delete data.activity.items;
    data.activity = data.activity.activity;
    return {
      info: data,
      items,
    };
    */
  }
};
