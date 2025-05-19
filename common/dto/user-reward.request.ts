import { EvaluationItem } from '../../apps/chrono/src/user-reward/types/evaluationItem';

export class UserRewardRequest {
  constructor(
    readonly eventId: string,
    readonly eventVersion: number,
    readonly evaluations: EvaluationItem[],
  ) {}
}
