import { EvaluationItem } from '../../user-reward/types/evaluationItem';

export enum EventConditionType {
  LOGIN_COUNT = 'LOGIN_COUNT',
  INVITE_FRIEND = 'INVITE_FRIEND',
  MONSTER_KILL = 'MONSTER_KILL',
}

export type EventCondition =
  | { type: EventConditionType.LOGIN_COUNT; loginCount: number }
  | { type: EventConditionType.INVITE_FRIEND; invite_friend: number }
  | {
      type: EventConditionType.MONSTER_KILL;
      kill_monster_id: number;
      count: number;
    };

export function evaluateEventCondition(
  condition: EventCondition,
  evaluations: EvaluationItem[],
): boolean {
  const matched = evaluations.find(
    (evaluation) => evaluation.type === condition.type,
  );
  if (!matched || !matched.data) return false;

  switch (condition.type) {
    case EventConditionType.LOGIN_COUNT:
      return matched.data.loginCount >= condition.loginCount;

    case EventConditionType.INVITE_FRIEND:
      return matched.data.invite_friend >= condition.invite_friend;

    case EventConditionType.MONSTER_KILL:
      return (
        matched.data.kill_monster_id === condition.kill_monster_id &&
        matched.data.count >= condition.count
      );

    default:
      return false;
  }
}
