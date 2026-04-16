import PixelBlast from "@/components/PixelBlast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background p-4 gap-4">
      {/* Decorative column — 50%, hidden below 1000px */}
      <div className="w-1/2 relative h-full overflow-hidden rounded-xl max-[1000px]:hidden">
        <PixelBlast
          variant="square"
          pixelSize={3}
          color="#7F77DD"
          patternScale={2}
          patternDensity={1.5}
          enableRipples
          rippleSpeed={0.45}
          rippleThickness={0.1}
          rippleIntensityScale={2}
          speed={0.5}
          transparent
          edgeFade={0}
        />
      </div>

      {/* Form column */}
      <div className="flex flex-col w-full min-[1000px]:w-1/2 items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="size-6 rounded-md bg-secondary" />
          Spring Board
        </div>

        <div className="w-full max-w-sm">{children}</div>

        <p className="px-8 text-center text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Spring Board
        </p>
      </div>
    </div>
  );
}
