"use client";
import { useState, useEffect, useRef } from "react";
import { Link, Zap } from "lucide-react";
import { Button } from "../ui/button";
// Update the import path below if your Card components are located elsewhere
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

// Renamed and ready for integration
export default function FeaturesTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const brandColor = "#0553f3"; // Using your brand color!

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulseEffect[relId] = true; });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.2) % 360);
      }, 50);
    }
    return () => clearInterval(rotationTimer);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = Math.min(containerRef.current?.offsetWidth || 0, containerRef.current?.offsetHeight || 0) * 0.35;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.sin(radian));
    const opacity = Math.max(0.4, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2));
    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    return timelineData.find((item) => item.id === itemId)?.relatedIds || [];
  };

  return (
   <div
  className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
  ref={containerRef}
  onClick={handleContainerClick}
>
  {/* The title div has been removed from here */}
  <div className="relative w-full max-w-4xl h-full flex items-center justify-center" ref={orbitRef} style={{ perspective: "1000px" }}>
        <div className="absolute w-16 h-16 rounded-full flex items-center justify-center z-10" style={{ background: brandColor }}>
          <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>
          <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>
        </div>
        <div className="absolute w-[70vmin] h-[70vmin] rounded-full border border-white/10"></div>
        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = !!expandedItems[item.id];
          const isPulsing = !!pulseEffect[item.id];
          const Icon = item.icon;
          return (
            <div key={item.id} ref={(el) => (nodeRefs.current[item.id] = el)} className="absolute transition-all duration-700 cursor-pointer" style={{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex: isExpanded ? 200 : position.zIndex, opacity: isExpanded ? 1 : position.opacity }} onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}>
              <div className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`} style={{ background: `radial-gradient(circle, rgba(5, 83, 243, 0.2) 0%, rgba(5, 83, 243, 0) 70%)` }}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform ${isExpanded ? "scale-150 shadow-lg" : ""} ${isExpanded ? "bg-white text-black border-white shadow-blue-500/30" : "bg-black text-white border-white/40"}`}>
                <Icon size={16} />
              </div>
              {isExpanded && (
                <Card className="absolute top-16 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-blue-500/10 overflow-visible z-50">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-white/80">
                    <p>{item.content}</p>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="flex items-center"><Zap size={10} className="mr-1" />Integration Level</span>
                        <span className="font-mono">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${item.energy}%`, background: brandColor }}></div>
                      </div>
                    </div>
                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center mb-2"><Link size={10} className="text-white/70 mr-1" /><h4 className="text-xs uppercase tracking-wider font-medium text-white/70">Connected Tech</h4></div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find((i) => i.id === relatedId);
                            return <Button key={relatedId} variant="outline" size="sm" className="h-6 px-2 py-0 text-xs rounded-sm border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}>{relatedItem?.title}</Button>;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}