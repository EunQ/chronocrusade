import { EvaluationItem } from '../types/evaluationItem';
import { ICommand } from '@nestjs/cqrs';

export class RequestUserRewardCommand implements ICommand {
  public readonly userId: string;
  public readonly eventId: string;
  public readonly eventVersion: number;
  public readonly evaluations: EvaluationItem[];

  constructor({
    userId,
    eventId,
    eventVersion,
    evaluations,
  }: {
    userId: string;
    eventId: string;
    eventVersion: number;
    evaluations: EvaluationItem[];
  }) {
    this.userId = userId;
    this.eventId = eventId;
    this.eventVersion = eventVersion;
    this.evaluations = evaluations;
  }
}
