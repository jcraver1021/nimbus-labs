import {NimbusInfoPanel} from '@nimbus-labs/ui';

export interface AlgorithmInfoPanelProps {
  name: string;
  timeComplexity: string;
  code: string;
}

/**
 * Shows an algorithm's name, time complexity, and pseudocode — the "info"
 * side of a sort/search visualizer's control row.
 */
export function AlgorithmInfoPanel({
  name,
  timeComplexity,
  code,
}: AlgorithmInfoPanelProps) {
  return (
    <NimbusInfoPanel
      title={name}
      subtitle={`Time complexity: ${timeComplexity}`}
      code={code}
    />
  );
}
