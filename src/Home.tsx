import { useState, useEffect } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "./components/TimerList";
import { Toaster } from "sonner";
import { TimerModal } from "./components/TimerModal";
import { Button } from "./components/Button";
import { TimerManager } from "./components/TimerManager";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position={isMobile ? "bottom-center" : "top-right"} />
      <TimerManager />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Timer App</h1>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 " />
              Add Timer
            </div>
          </Button>
        </div>

        <TimerList />
        <TimerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="add"
        />
      </div>
    </div>
  );
}

export default Home;