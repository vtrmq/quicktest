import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { activityLocalstore } from '$lib/store/activity';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const _items = activityLocalstore.get();
    const items = _items === null ? (JSON.parse(data.activity.items) ? JSON.parse(data.activity.items) : []) : _items;

    if (items.length === 0) { 
      activityLocalstore.set([]) 
    } else {
      activityLocalstore.set(JSON.parse(data.activity.items));
    }

    const activity = data.activity.activity;
    const activityId = data.activity.activity_id;
    const topicId = data.topic.topic_id;
    const topic = data.topic.topic;

    return {
      activityId,
      activity,
      items,
      topicId,
      topic,
    };
  }
};
