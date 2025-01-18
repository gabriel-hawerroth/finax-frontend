export enum ReleaseType {
  EXPENSE = 'E',
  REVENUE = 'R',
  TRANSFER = 'T',
  INVOICE = 'I',
}

export enum ReleaseRepeat {
  FIXED = 'FIXED',
  INSTALLMENTS = 'INSTALLMENTS',
}

export enum ReleaseFixedBy {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  BIMONTHLY = 'BIMONTHLY',
  QUARTERLY = 'QUARTERLY',
  BIANNUAL = 'BIANNUAL',
  ANNUAL = 'ANNUAL',
}

export function toReleaseType(releaseType: 'E' | 'R' | 'T' | 'I'): ReleaseType {
  switch (releaseType) {
    case 'E':
      return ReleaseType.EXPENSE;
    case 'R':
      return ReleaseType.REVENUE;
    case 'T':
      return ReleaseType.TRANSFER;
    case 'I':
      return ReleaseType.INVOICE;
    default:
      throw new Error(`Invalid release type: ${releaseType}`);
  }
}
