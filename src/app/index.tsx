import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import { HomeCards } from '../components/home/HomeCards';
import { HomeClassic } from '../components/home/HomeClassic';
import { HomePoster } from '../components/home/HomePoster';
import { HomeRing } from '../components/home/HomeRing';
import { HomeTelemetry } from '../components/home/HomeTelemetry';
import { useHomeData } from '../components/home/useHomeData';
import { DEFAULT_HOME_DESIGN, getHomeDesign, isHomeDesignId } from '../storage/homeDesign';
import type { HomeDesignId } from '../storage/homeDesign';

/** Home: the layout is the one chosen in Settings > Home design (add ?design=ring and so on to try one without saving it). */
export default function HomeScreen() {
  const data = useHomeData();
  const params = useLocalSearchParams<{ design?: string }>();
  const [saved, setSaved] = useState<HomeDesignId>(DEFAULT_HOME_DESIGN);
  useFocusEffect(
    useCallback(() => {
      getHomeDesign().then(setSaved);
    }, []),
  );
  const design: HomeDesignId = isHomeDesignId(params.design) ? params.design : saved;
  const start = () => router.push('/create-session');

  switch (design) {
    case 'ring':
      return <HomeRing data={data} onStart={start} />;
    case 'cards':
      return <HomeCards data={data} onStart={start} />;
    case 'poster':
      return <HomePoster data={data} onStart={start} />;
    case 'telemetry':
      return <HomeTelemetry data={data} onStart={start} />;
    default:
      return <HomeClassic data={data} onStart={start} />;
  }
}
