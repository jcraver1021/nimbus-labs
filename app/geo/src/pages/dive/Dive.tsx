import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Typography} from '@mui/material';
import {NimbusBreadcrumbs} from '@nimbus-labs/ui';
import {buildDiveSpine, stratumTime} from '../../utils/diveSpine';
import {
  DEPTH_MARKER_FRACTION,
  divePositionAt,
  scrollTopForDepth,
  type DivePosition,
} from '../../utils/diveLayout';
import DepthRail from '../../components/DepthRail';
import EarthStatePanel from '../../components/EarthStatePanel';
import StrataColumn from '../../components/StrataColumn';
import './Dive.css';

function Dive() {
  const strata = useMemo(() => buildDiveSpine(), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DivePosition>({
    index: 0,
    fraction: 0,
  });

  // The scroll position is the single source of truth for depth: the rail
  // scrolls the column, and the column reports back where it landed.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () =>
      setPosition(divePositionAt(container.scrollTop, strata.length));

    handleScroll();
    container.addEventListener('scroll', handleScroll, {passive: true});
    return () => container.removeEventListener('scroll', handleScroll);
  }, [strata.length]);

  const travelTo = useCallback((depth: number) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({top: scrollTopForDepth(depth), behavior: 'smooth'});
  }, []);

  const activeStratum = strata[position.index];
  const yearsAgo = stratumTime(activeStratum, position.fraction);

  return (
    <Box className="dive-page">
      <Box className="dive-header">
        <NimbusBreadcrumbs
          items={[{label: 'Geo', href: '/'}, {label: 'Dive'}]}
        />
        <Typography variant="h4" component="h1">
          A Dive Through Deep Time
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dig down from today to the formation of the planet, one division of
          the geologic time scale at a time.
        </Typography>
      </Box>

      <Box className="dive-body">
        <DepthRail
          strata={strata}
          depth={position.index + position.fraction}
          onDepthChange={travelTo}
        />

        <Box className="dive-scroll-area">
          <Box className="dive-scroll" ref={scrollRef} tabIndex={0}>
            <StrataColumn strata={strata} activeIndex={position.index} />
          </Box>

          <Box
            className="dive-marker"
            aria-hidden="true"
            style={{top: `${DEPTH_MARKER_FRACTION * 100}%`}}
          />
        </Box>

        <EarthStatePanel stratum={activeStratum} yearsAgo={yearsAgo} />
      </Box>
    </Box>
  );
}

export default Dive;
