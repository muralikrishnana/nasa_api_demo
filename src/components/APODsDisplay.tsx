import { Loader, ScrollArea, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { NASA_API_Response } from '../types/nasa-api';
import cssClasses from './APODsDisplay.module.scss';
import { MediaCard } from './MediaCard';

interface APODsDisplayProps {
  isLoading: boolean;

  data: NASA_API_Response[];
}

const ITEMS_IN_ONE_ROW = 7;

export function APODsDisplay({ isLoading, data }: APODsDisplayProps) {
  const [apodGroups, setApodGroups] = useState<NASA_API_Response[][]>([[]]);

  useEffect(() => {
    const apodGroups: NASA_API_Response[][] = [];

    data.forEach((datum, index) => {
      if (index % ITEMS_IN_ONE_ROW === 0) apodGroups.push([]);

      const groupNumber = Math.floor(index / ITEMS_IN_ONE_ROW);
      apodGroups[groupNumber].push(datum);
    });

    setApodGroups(apodGroups);
  }, [data]);

  const { colorScheme } = useMantineColorScheme();
  const darkScheme = colorScheme === 'dark';

  return (
    <div className={cssClasses.container}>
      {apodGroups.map((gp, index) => {
        return (
          <ScrollArea style={{ maxWidth: '100vw' }} type={'hover'} key={`Group-${index}`}>
            <div className={cssClasses.row}>
              {gp.map((item) => {
                return <MediaCard data={item} key={item.date} />;
              })}
            </div>
          </ScrollArea>
        );
      })}

      <div className={cssClasses.loader}>
        {isLoading && <Loader variant='dots' color={darkScheme ? 'blue' : 'dark'} />}
      </div>
    </div>
  );
}
