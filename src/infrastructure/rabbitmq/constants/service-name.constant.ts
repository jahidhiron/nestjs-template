export const ServiceNames = {
  NESTJS_TEMPLATE_SYNC: 'NESTJS_TEMPLATE_SYNC',
} as const;

export type ServiceName = (typeof ServiceNames)[keyof typeof ServiceNames];
