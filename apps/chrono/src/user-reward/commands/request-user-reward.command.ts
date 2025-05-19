import { EvaluationItem } from '../types/evaluationItem';
import { ICommand } from '@nestjs/cqrs';

export class RequestUserRewardCommand implements ICommand {
  userId: string;
  eventId: string;
  eventVersion: number;
  evaluations: EvaluationItem[];
}
