import { BackgroundPaths } from "@/components/ui/background-paths";
import { ToggleTheme } from "@/components/toggle-theme";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="absolute top-5 right-5 z-50">
        <ToggleTheme />
      </div>

      <BackgroundPaths />
    </main>
  );
}
