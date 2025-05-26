import { differenceInDays, formatDistanceToNow, format } from "date-fns";
export function getFinalTime(strPostCreateAt: string) {
  const today = new Date();
  const createTime = new Date(strPostCreateAt);
  const distanceTime = formatDistanceToNow(createTime, {
    addSuffix: true,
  });
  const diffDays = differenceInDays(today, createTime);
  const finalTime =
    diffDays > 7 ? format(createTime, "yyyy-MM-dd") : distanceTime;
  return finalTime;
}
