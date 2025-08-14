import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function CustomToaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props} className="bg-white border-none shadow-lg">
          <div className="grid gap-1 p-2">
            {title && <div className="font-bold text-xl text-[#F67721] text-[#FFFFFF]">{title}</div>}
            {description && <div className="text-lg font-semibold text-[#F67721] text-[#FFFFFF]">{description}</div>}
          </div>
          {action}
        </Toast>
      ))}
      <ToastViewport className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}
