
import { useToast as useToastHook, toast as toastFunction, ToastActionElement } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastFunction;
export type { ToastActionElement };
