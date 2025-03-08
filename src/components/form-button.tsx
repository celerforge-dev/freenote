import { Icons } from "@/components/icons";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useFormState } from "react-hook-form";

interface FormButtonProps extends ButtonProps {
  pendingText?: string;
}

export function FormButton({
  children,
  pendingText,
  className,
  ...props
}: FormButtonProps) {
  const { isSubmitting } = useFormState();

  return (
    <Button className={className} disabled={isSubmitting} {...props}>
      {isSubmitting ? (
        <>
          <Icons.refreshCw className="sp-mr-2 sp-h-4 sp-w-4 sp-animate-spin" />
          {pendingText || "Processing..."}
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
