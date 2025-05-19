export type RewardItem = {
  type: string; // ex: gold, exp, coupon, item, etc.
  id?: string | null; // ex: 쿠폰 코드, 아이템 ID 등
  count: number; // 지급 수량
  meta?: Record<string, any>; // 추가 속성 (optional)
};
