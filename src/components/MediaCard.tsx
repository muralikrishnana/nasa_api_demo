import { Card, createStyles, Group, Text } from '@mantine/core';
import ReactPlayer from 'react-player';
import { NASA_API_Response } from '../types/nasa-api';
import cssClasses from './MediaCard.module.scss';

const useStyles = createStyles((theme) => ({
  card: {
    maxWidth: '20rem',
    minWidth: '20rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
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
  const { classes } = useStyles();

  return (
    <Card withBorder radius='md' p={0} className={classes.card}>
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

      <Group p={0} position='apart' m='sm'>
        <div>
          <div className={cssClasses.titleRow}>
            <div style={{ flex: 3 }}>
              <Text weight={500} size={14} lineClamp={1}>
                {data.title}
              </Text>
            </div>
            <div style={{ flex: 1 }}>
              <Text weight={500} size={14}>
                {data.date}
              </Text>
            </div>
          </div>
          <Text size='xs' color='dimmed' lineClamp={2}>
            {data.explanation}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
