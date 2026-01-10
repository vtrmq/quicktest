import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { activityLocalstore } from '$lib/store/activity';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const _items = activityLocalstore.get();
    const items = _items === null ? (data.activity.items ? data.activity.items : []) : _items;
    if (_items === null) { activityLocalstore.set([]) }

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
