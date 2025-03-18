
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  mobileRatio?: number;
}

const AspectRatio = ({ 
  className, 
  mobileRatio,
  ratio = 16 / 9,
  ...props 
}: AspectRatioProps) => {
  const isMobile = useIsMobile();
  
  // Use different aspect ratio on mobile if specified
  const effectiveRatio = isMobile && mobileRatio ? mobileRatio : ratio;
  
  return (
    <AspectRatioPrimitive.Root
      ratio={effectiveRatio}
      className={cn(className)}
      {...props}
    />
  );
}

export { AspectRatio }
