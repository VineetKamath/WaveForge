import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Service } from '../lib/data';

interface Props {
  services: Service[];
  violations: { sourceId: string; targetId: string }[];
  highlightedId: string | null;
}

export function DependencyGraph({ services, violations, highlightedId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || services.length === 0) return;

    const width = 1000;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Setup definitions for arrowheads
    svg.append("defs").selectAll("marker")
      .data(["end", "violation-end"])
      .join("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Offset to not overlap with node
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => d === "violation-end" ? "#ef4444" : "#9ca3af")
      .attr("d", "M0,-5L10,0L0,5");

    // Prepare nodes and links
    const nodes = services.map(s => Object.create(s));
    const links: any[] = [];
    
    services.forEach(s => {
      s.dependencies.forEach(depId => {
        const isViolation = violations.some(v => v.sourceId === s.id && v.targetId === depId);
        links.push({ source: s.id, target: depId, isViolation });
      });
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => Math.sqrt(d.dependents?.length || 0) * 5 + 20));

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.isViolation ? "#ef4444" : "#9ca3af")
      .attr("stroke-width", d => d.isViolation ? 3 : 1.5)
      .attr("marker-end", d => d.isViolation ? "url(#violation-end)" : "url(#end)");

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => Math.max(10, Math.sqrt(d.dependents?.length || 0) * 5 + 10))
      .attr("fill", (d: any) => {
        switch (d.criticality) {
          case 'Critical': return '#ef4444'; // red
          case 'High': return '#f97316'; // orange
          case 'Medium': return '#3b82f6'; // blue
          case 'Low': return '#22c55e'; // green
          default: return '#9ca3af';
        }
      })
      .attr("opacity", (d: any) => highlightedId ? (d.id === highlightedId ? 1 : 0.2) : 1)
      .call(drag(simulation) as any);

    node.append("title")
      .text((d: any) => `${d.name}\nWave: ${d.wave}\nStrategy: ${d.strategy}\nRisk: ${d.riskScore}`);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#374151")
      .attr("pointer-events", "none")
      .text((d: any) => d.name)
      .attr("opacity", (d: any) => highlightedId ? (d.id === highlightedId ? 1 : 0.2) : 1);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
        
      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y - ((Math.max(10, Math.sqrt(d.dependents?.length || 0) * 5 + 10)) + 5));
    });

    // Animate nodes in
    node.attr("r", 0).transition().duration(750).attr("r", (d: any) => Math.max(10, Math.sqrt(d.dependents?.length || 0) * 5 + 10));

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [services, violations, highlightedId]);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-sm border border-gray-200 text-xs">
        <div className="font-semibold mb-2">Criticality</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> High</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Medium</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Low</div>
      </div>
    </div>
  );
}
