export type ResponseParams<T extends object = any> =
  | ({
      module?: string;
      key?: string;
      message?: string;
      args?: Record<string, any>;
    } & T)
  | ({
      message?: string;
      module?: never;
      key?: never;
      args?: Record<string, any>;
    } & T);
