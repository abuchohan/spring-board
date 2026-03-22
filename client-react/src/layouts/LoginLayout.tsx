import { Outlet } from "react-router-dom";
import PixelBlast from "@/components/PixelBlast";

const LoginLayout = () => {
  return (
    <div className="flex h-screen bg-background p-4 gap-4">
      {/* Decorative column — 50%, hidden below 1000px */}
      <div className="w-1/2 corner-squircle relative h-full overflow-hidden rounded-xl supports-[corner-shape:squircle]:rounded-2xl max-[1000px]:hidden">
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

      {/* Form column — 50% on wide, full width on narrow */}
      <div className="flex flex-col w-full min-[1000px]:w-1/2 items-center justify-between px-8 py-4">
        {/* Temp logo */}
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="size-6 rounded-md bg-secondary" />
          Spring Board
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>

        <p className="px-8 text-center text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Spring Board
        </p>
      </div>
    </div>
  );
};

export default LoginLayout;
