import { toast } from "sonner";
import type { ExternalToast } from "sonner";

type ToastId = string | number;

type ShowOptions = ExternalToast;

export function showSuccess(message: string, options?: ShowOptions) {
  return toast.success(message, options);
}

export function showError(message: string, options?: ShowOptions) {
  return toast.error(message, options);
}

export function showInfo(message: string, options?: ShowOptions) {
  return toast(message, options);
}

export function showLoading(message: string, options?: ShowOptions) {
  return toast.loading(message, options);
}

export function dismissToast(id?: ToastId) {
  toast.dismiss(id);
}

export { toast };
export type { ToastId, ShowOptions };
