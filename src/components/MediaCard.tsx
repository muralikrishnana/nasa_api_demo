import { Card, createStyles, Modal, Text } from '@mantine/core';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { NASA_API_Response } from '../types/nasa-api';
import cssClasses from './MediaCard.module.scss';
import { TodayAPOD } from './TodayAPOD';

const useStyles = createStyles((theme) => ({
  card: {
    maxWidth: '20rem',
    minWidth: '20rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    cursor: 'pointer',
  },

  imageSection: {
    height: '14rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
}));

interface MediaCardProps {
  data: NASA_API_Response;
}

export function MediaCard({ data }: MediaCardProps) {
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);

  const { classes } = useStyles();

  return (
    <>
      <Modal
        withCloseButton={false}
        opened={moreInfoModalOpen}
        overflow='inside'
        centered
        size={'90%'}
        onClose={() => setMoreInfoModalOpen(false)}>
        <TodayAPOD isLoading={false} data={data} />
      </Modal>
      <Card withBorder radius='md' p={0} className={classes.card} onClick={() => setMoreInfoModalOpen(true)}>
        <Card.Section className={classes.imageSection}>
          {(data?.media_type === 'image' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `url('${data.url}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}></div>
          )) || <ReactPlayer height={'100%'} light={data.thumbnail_url} controls url={data.url} />}
        </Card.Section>

        <div className={cssClasses.infoContainer}>
          <div className={cssClasses.titleRow}>
            <div style={{ flex: 1 }}>
              <Text weight={500} size={14} lineClamp={1}>
                {data.title}
              </Text>
            </div>
            <Text weight={500} size={14} align='right'>
              {data.date}
            </Text>
          </div>
          <Text size='xs' color='dimmed' lineClamp={2}>
            {data.copyright}
          </Text>
        </div>
      </Card>
    </>
  );
}
