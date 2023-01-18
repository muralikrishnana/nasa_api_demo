import { AppHeader } from '@/src/components/AppHeader';
import { useWindowScroll } from '@mantine/hooks';
import moment from 'moment';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react';
import { APODsDisplay } from '../components/APODsDisplay';
import { TodayAPOD } from '../components/TodayAPOD';
import { NASA_API_COMPLIANT_DATE_FORMAT } from '../misc/constants';
import { APOD_Request_Data, NASA_API_Response, Success_Based_Response } from '../types/nasa-api';

async function fetchAPODs(props: APOD_Request_Data): Promise<Success_Based_Response<NASA_API_Response[]>> {
  // fetches APODs from backend
  const response = await fetch(`/api/apod?startDate=${props.startDate}&endDate=${props.endDate}`);

  return response.json();
}

export default function Home() {
  const [apods, setApods] = useState<NASA_API_Response[]>([]);
  const [apodLoading, setApodLoading] = useState<boolean>(false);

  const oldestAPODRef = useRef<NASA_API_Response | null>();
  const apodLoadingRef = useRef<boolean>();

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    if (apods.length < 1) oldestAPODRef.current = null;
    else oldestAPODRef.current = apods[apods.length - 1];
  }, [apods]);

  useEffect(() => {
    apodLoadingRef.current = apodLoading;
  }, [apodLoading]);

  const loadMoreAPODs = useCallback(async () => {
    if (apodLoadingRef.current) return [];

    if (!oldestAPODRef.current) return [];

    const lastLoadedDateMinus1Day = moment(oldestAPODRef.current.date)
      .subtract(1, 'day')
      .format(NASA_API_COMPLIANT_DATE_FORMAT);
    const startDate = moment(lastLoadedDateMinus1Day).subtract(11, 'days').format(NASA_API_COMPLIANT_DATE_FORMAT);

    setApodLoading(true);

    const moreAPODsResponse = await fetchAPODs({
      startDate,
      endDate: lastLoadedDateMinus1Day,
    });

    setApodLoading(false);

    if (moreAPODsResponse.success && Array.isArray(moreAPODsResponse.data) && moreAPODsResponse.data.length > 0) {
      return moreAPODsResponse.data;
    }

    return [];
  }, []);

  useEffect(() => {
    // infinite loading
    const totalHeightOfPage = document.body.scrollHeight;
    const shouldLoadMore = totalHeightOfPage - scroll.y - window.innerHeight < 0;

    if (!shouldLoadMore) return;

    (async () => {
      const moreAPODs = await loadMoreAPODs();

      if (moreAPODs.length < 1) return;

      setApods((apods) => {
        return [...apods, ...moreAPODs.reverse()];
      });
    })();
  }, [loadMoreAPODs, scroll]);

  useEffect(() => {
    (async () => {
      const today = moment().format(NASA_API_COMPLIANT_DATE_FORMAT);
      const yesterday = moment().subtract(1, 'days').format(NASA_API_COMPLIANT_DATE_FORMAT);
      const elevenDaysBeforeToday = moment().subtract(11, 'days').format(NASA_API_COMPLIANT_DATE_FORMAT);

      setApodLoading(true);

      // we send separate todayApod requests as there are chances today's datum is
      // not available yet. in that case we need to fallback to latest apod
      const [todayApodResponse, prevDaysApodResponse] = await Promise.all([
        fetchAPODs({
          startDate: today,
          endDate: today,
        }),
        fetchAPODs({
          startDate: elevenDaysBeforeToday,
          endDate: yesterday,
        }),
      ]);

      setApodLoading(false);

      let apods = [];

      if (todayApodResponse.success && Array.isArray(todayApodResponse.data) && todayApodResponse.data.length > 0) {
        apods.push(todayApodResponse.data[0]);
      }

      if (
        prevDaysApodResponse.success &&
        Array.isArray(prevDaysApodResponse.data) &&
        prevDaysApodResponse.data.length > 0
      ) {
        apods = apods.concat(prevDaysApodResponse.data.reverse());
      }

      setApods(apods);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>NASA API DEMO</title>
        <meta name='description' content='Sample application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
      </Head>
      <main>
        <AppHeader />
        <div>
          <TodayAPOD isLoading={apods.length < 1} data={apods.length > 0 ? apods[0] : null} />
          <APODsDisplay isLoading={apodLoading} data={apods.length > 1 ? apods.slice(1, apods.length) : []} />
        </div>
      </main>
    </>
  );
}
