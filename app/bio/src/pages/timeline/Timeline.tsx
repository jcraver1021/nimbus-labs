import {useState, useEffect, useRef} from 'react';
import {Box, Typography} from '@mui/material';
import {formatTimeYearsAgo, getTimeValue} from '@nimbus-labs/deeptime';
import {createArthropodGraph} from '../../data/arthropods';
import GeologicTimeScale from '../../components/GeologicTimeScale';
import {calculateTreeLayout} from '../../utils/treeLayout';
import './Timeline.css';

function Timeline() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const graph = createArthropodGraph();

  // Time range for the visualization (in years ago)
  const timeRange = {
    start: 550_000_000, // 550 million years ago
    end: 0, // Present
  };

  // Map scroll position (0-1) to time
  const scrollToTime = (scroll: number): number => {
    return timeRange.start - scroll * (timeRange.start - timeRange.end);
  };

  const currentTime = scrollToTime(scrollPosition);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const {scrollTop, scrollHeight, clientHeight} = containerRef.current;
        const maxScroll = scrollHeight - clientHeight;
        const position = maxScroll > 0 ? scrollTop / maxScroll : 0;
        setScrollPosition(position);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate pixel height for time range
  const totalYears = timeRange.start - timeRange.end;
  const pixelsPerMillion = 2; // 2 pixels per million years
  const timelineHeight = (totalYears / 1_000_000) * pixelsPerMillion;

  // Get nodes and edges
  const nodes = Array.from(graph.nodes.values());
  const edges = Array.from(graph.edges.values());

  // Calculate tree layout positions
  const xSpacing = 100;
  const nodePositions = calculateTreeLayout(graph, xSpacing);

  // Calculate total width needed
  const maxX = Math.max(...Array.from(nodePositions.values()), 0);
  const totalWidth = maxX + 200;

  return (
    <Box className="timeline-container" ref={containerRef}>
      <Box className="timeline-header">
        <Typography variant="h4">
          Arthropod Evolution Timeline (Example)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
          This is a demonstration of deep time visualization. Scroll down to
          travel forward through time.
        </Typography>
        <Typography variant="subtitle1">
          Current view: {formatTimeYearsAgo(currentTime)}
        </Typography>
      </Box>

      <Box className="timeline-content" style={{height: `${timelineHeight}px`}}>
        {/* Geologic time scale (Era → Epoch → Period hierarchy) */}
        <GeologicTimeScale
          timeRange={timeRange}
          totalYears={totalYears}
          timelineHeight={timelineHeight}
        />

        {/* SVG for tree connections */}
        <svg
          className="tree-connections"
          style={{
            position: 'absolute',
            left: '440px',
            top: 0,
            width: `${totalWidth}px`,
            height: `${timelineHeight}px`,
            pointerEvents: 'none',
          }}
        >
          {edges.map(edge => {
            const sourceNode = graph.nodes.get(edge.sourceId);
            const targetNode = graph.nodes.get(edge.targetId);
            if (!sourceNode || !targetNode) return null;

            const divergenceTime = getTimeValue(edge.divergenceTime);
            const targetOriginTime = getTimeValue(targetNode.timeOfOrigin);
            const sourceX = (nodePositions.get(edge.sourceId) || 0) + 1.5;
            const targetX = (nodePositions.get(edge.targetId) || 0) + 1.5;

            const divergenceY =
              ((timeRange.start - divergenceTime) / totalYears) *
              timelineHeight;
            const targetOriginY =
              ((timeRange.start - targetOriginTime) / totalYears) *
              timelineHeight;

            // Draw branch: horizontal line from parent, then vertical down to child
            const path = `
              M ${sourceX} ${divergenceY}
              L ${targetX} ${divergenceY}
              L ${targetX} ${targetOriginY}
            `;

            return (
              <g key={edge.id}>
                <path
                  d={path}
                  stroke="#ff5722"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                  strokeLinejoin="round"
                />
                {/* Divergence point marker */}
                <circle
                  cx={sourceX}
                  cy={divergenceY}
                  r="4"
                  fill="#ff5722"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Lineages */}
        <Box className="lineages">
          {nodes.map(node => {
            const nodeTime = getTimeValue(node.timeOfOrigin);
            const extinctionTime = node.timeOfExtinction
              ? getTimeValue(node.timeOfExtinction)
              : 0;

            const startY =
              ((timeRange.start - nodeTime) / totalYears) * timelineHeight;
            const endY =
              ((timeRange.start - extinctionTime) / totalYears) *
              timelineHeight;
            const lineHeight = endY - startY;
            const xPos = nodePositions.get(node.id) || 0;

            return (
              <Box
                key={node.id}
                className="lineage"
                style={{
                  left: `${xPos}px`,
                  top: `${startY}px`,
                  height: `${lineHeight}px`,
                }}
              >
                <Box className="lineage-line" />
                <Box className="lineage-label">
                  <Typography variant="body2">{node.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeYearsAgo(nodeTime)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Divergence points */}
        <Box className="divergence-points">
          {edges.map(edge => {
            const sourceNode = graph.nodes.get(edge.sourceId);
            const targetNode = graph.nodes.get(edge.targetId);
            const divergenceTime = getTimeValue(edge.divergenceTime);

            if (!sourceNode || !targetNode) return null;

            const y =
              ((timeRange.start - divergenceTime) / totalYears) *
              timelineHeight;

            return (
              <Box
                key={edge.id}
                className="divergence-point"
                style={{top: `${y}px`}}
              >
                <Box className="divergence-marker" />
                <Typography variant="caption" className="divergence-label">
                  {targetNode.name} splits from {sourceNode.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Timeline;
