import { Meta } from '../interfaces';

export type IFindAll<T, K extends string = 'collection'> = {
  [key in K]: T[];
} & {
  meta: Meta;
};
