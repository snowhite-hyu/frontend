import { useHealthyActions, useIsHealthy } from "@/stores/common/HealthyStore";
import type React from "react";
import { type ReactNode, useEffect } from "react"
import WifiUI from "../ui/Wifi";

interface HealthyLayerProps {
  children: ReactNode;
}

const HealthyLayer: React.FC<HealthyLayerProps> = ({ children }) => {
  const isHealthy = useIsHealthy();
  const healthyActions = useHealthyActions();

  useEffect(() => {
    const checkHealthInterval = setInterval(() => healthyActions.checkHealth(), 1000);
    return () => clearInterval(checkHealthInterval);
  }, [healthyActions]);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full flex justify-end-safe items-end-safe py-2 px-2">
        <WifiUI status={isHealthy ? "search" : "poor-connection"} width={50} height={50} />
      </div>
      <div className="content mt-12 p-4">
        {children}
      </div>
    </div>
  );
}

export default HealthyLayer;
