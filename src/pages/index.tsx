import { AppHeader } from '@/src/components/AppHeader';
import moment from 'moment';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { TodayAPOD } from '../components/TodayAPOD';

import { APODsDisplay } from '../components/APODsDisplay';
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
