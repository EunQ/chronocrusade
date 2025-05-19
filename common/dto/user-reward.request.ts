import { EvaluationItem } from '../../apps/chrono/src/user-reward/types/evaluationItem';

export class UserRewardRequest {
  userId: string;
  eventId: string;
  eventVersion: number;
  evaluations: EvaluationItem[];
}
