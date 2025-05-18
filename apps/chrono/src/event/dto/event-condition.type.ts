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
