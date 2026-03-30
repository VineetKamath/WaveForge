import React from 'react';
import { motion } from 'motion/react';
import { Service } from '../lib/data';
import { DndContext, closestCenter, DragEndEvent, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  services: Service[];
  waves: number;
  onMoveService: (serviceId: string, newWave: number) => void;
  onHoverService: (serviceId: string | null) => void;
}

export function WaveTimeline({ services, waves, onMoveService, onHoverService }: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const serviceId = active.id as string;
    const overId = over.id as string;
    
    if (overId.startsWith('wave-')) {
      const newWave = parseInt(overId.split('-')[1], 10);
      const service = services.find(s => s.id === serviceId);
      if (service && service.wave !== newWave) {
        onMoveService(serviceId, newWave);
      }
    }
  };

  const waveArray = Array.from({ length: waves }, (_, i) => i + 1);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {waveArray.map(waveNum => (
          <WaveRow 
            key={waveNum} 
            waveNum={waveNum} 
            services={services.filter(s => s.wave === waveNum)} 
            onHoverService={onHoverService}
          />
        ))}
      </div>
    </DndContext>
  );
}

interface WaveRowProps { key?: React.Key; waveNum: number; services: Service[]; onHoverService: (id: string | null) => void; }
function WaveRow({ waveNum, services, onHoverService }: WaveRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `wave-${waveNum}` });

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="w-24 shrink-0 font-medium text-gray-700">Wave {waveNum}</div>
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ duration: 0.5, delay: waveNum * 0.1 }}
        className={`flex-1 rounded-lg p-3 min-h-[60px] flex flex-wrap gap-2 border ${isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
        ref={setNodeRef}
      >
        {services.map(service => (
          <ServiceChip key={service.id} service={service} onHoverService={onHoverService} />
        ))}
        {services.length === 0 && <span className="text-gray-400 text-sm italic py-1">Drop services here</span>}
      </motion.div>
    </div>
  );
}

interface ServiceChipProps { key?: React.Key; service: Service; onHoverService: (id: string | null) => void; }
function ServiceChip({ service, onHoverService }: ServiceChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: service.id });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  let bgColor = 'bg-gray-100 text-gray-800 border-gray-200';
  if (service.strategy === 'Rehost') bgColor = 'bg-green-100 text-green-800 border-green-200';
  else if (service.strategy === 'Replatform') bgColor = 'bg-amber-100 text-amber-800 border-amber-200';
  else if (service.strategy === 'Refactor') bgColor = 'bg-red-100 text-red-800 border-red-200';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={(e) => {
        // Prevent drag from immediately clearing if we just want to highlight
        // Actually, dnd-kit handles pointer events, so we might need to be careful.
        // Let's just use onClick or onPointerDown.
        onHoverService(service.id);
      }}
      className={`px-3 py-1.5 rounded-md text-xs font-medium border cursor-grab active:cursor-grabbing shadow-sm ${bgColor} ${isDragging ? 'opacity-50 ring-2 ring-blue-500' : ''}`}
      title={`${service.name} (${service.strategy})`}
    >
      {service.name}
    </div>
  );
}
