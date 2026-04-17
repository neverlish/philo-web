import { format, subDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const KST = "Asia/Seoul";

/** 현재 한국 날짜를 YYYY-MM-DD 형식으로 반환 (클라이언트/서버 모두 안전) */
export function getTodayKST(): string {
  return formatInTimeZone(new Date(), KST, "yyyy-MM-dd");
}

/** 오늘 기준 최근 N일의 KST 날짜 배열 반환 (오래된 순) */
export function getRecentDaysKST(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    return formatInTimeZone(subDays(new Date(), n - 1 - i), KST, "yyyy-MM-dd");
  });
}

/** 임의 날짜/문자열을 KST 기준 YYYY-MM-DD 문자열로 변환 */
export function toKSTDateString(date: Date | string): string {
  return formatInTimeZone(new Date(date), KST, "yyyy-MM-dd");
}

/** KST 기준 이번 달 1일 00:00:00의 UTC ISO 문자열 반환 (Supabase gte 쿼리용) */
export function getFirstDayOfMonthKST(): string {
  const yyyyMM = formatInTimeZone(new Date(), KST, "yyyy-MM");
  return new Date(`${yyyyMM}-01T00:00:00+09:00`).toISOString();
}

/** KST 기준 현재 월 이름 반환 (예: "4월") */
export function getKSTMonthName(): string {
  return `${formatInTimeZone(new Date(), KST, "M")}월`;
}
