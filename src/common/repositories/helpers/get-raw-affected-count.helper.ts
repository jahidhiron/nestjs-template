import { RawUpdateResult } from '@/common/repositories/helpers/types';

export function getAffectedCount(result: RawUpdateResult): number {
  if (Array.isArray(result)) {
    // Many repos return `[ResultSetHeader]` for exec statements
    return result.length ? getAffectedCount(result[0]) : 0;
  }

  if ('affectedRows' in result) return result.affectedRows;
  if ('rowCount' in result) return result.rowCount;
  if ('affected' in result) return result.affected;
  if ('changes' in result) return result.changes;

  return 0;
}
