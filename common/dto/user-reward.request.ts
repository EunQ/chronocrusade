import { EvaluationItem } from '../../apps/chrono/src/user-reward/types/evaluationItem';

export class UserRewardRequest {
  eventId: string;
  eventVersion: number;
  evaluations: EvaluationItem[];
}
