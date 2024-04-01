export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
