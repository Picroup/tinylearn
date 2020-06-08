import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotificationEntity, NotificationKind } from '../../entity/NotificationEntity';

export function followUserNotification(
  { targetUserId, userId, tagName }: { targetUserId: string; userId: string; tagName: string; },
): QueryDeepPartialEntity<NotificationEntity> {
  return {
    kind: NotificationKind.followUser,
    targetUserId,
    followUserUserId: userId,
    followUserTagName: tagName,
  }; 
}

export function upPostNotification(
  { targetUserId, userId, postId }: { targetUserId: string; userId: string; postId: string; },
): QueryDeepPartialEntity<NotificationEntity> {
  return {
    kind: NotificationKind.upPost,
    targetUserId,
    upPostUserId: userId,
    upPostPostId: postId,
  };
}

export function markPostNotification(
  { targetUserId, userId, postId }: { targetUserId: string; userId: string; postId: string; },
): QueryDeepPartialEntity<NotificationEntity> {
  return {
    kind: NotificationKind.markPost,
    targetUserId,
    markPostUserId: userId,
    markPostPostId: postId,
  };
}