import { createStyles, Modal, Skeleton, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { NASA_API_Response } from '../types/nasa-api';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]}`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'column-reverse',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 200,
    },
  },

  mediaContainer: {
    cursor: 'pointer',
  },

  mediaContainerInModal: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  image: {
    flex: 3,
    maxWidth: '60%',

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      flex: 6,
    },

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '80%',
      maxWidth: '80%',
    },

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      width: '100%',
      maxWidth: '100%',
    },
  },

  body: {
    flex: 4,
    paddingRight: theme.spacing.xl * 4,
    display: 'flex',
    width: '100%',

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },
}));

interface TodayAPODProps {
  isLoading: boolean;

  data: NASA_API_Response | null;
}

export function TodayAPOD({ isLoading, ...props }: TodayAPODProps) {
  const [mediaModalOpen, setMediaModalOpen] = useState<boolean>(false);

  const { classes } = useStyles();

  return (
    <>
      {props.data !== null && (
        <Modal
          centered
          withCloseButton={false}
          opened={mediaModalOpen}
          styles={() => {
            return {
              body: {
                height: '60vh',
              },
            };
          }}
          onClose={() => setMediaModalOpen(false)}>
          <div className={classes.mediaContainerInModal}>
            {(props.data.media_type === 'image' && (
              <Image
                src={props.data.url}
                loader={() => props.data?.url ?? ''}
                fill
                style={{ objectFit: 'contain' }}
                alt={props.data?.title}
              />
            )) || (
              <ReactPlayer
                style={{ width: '25rem', height: '25rem', maxHeight: '72vw', maxWidth: '72vw' }}
                light={props.data?.thumbnail_url}
                controls
                url={props.data?.url}
                className={classes.image}
              />
            )}
          </div>
        </Modal>
      )}
      <div className={classes.wrapper}>
        <div className={classes.body}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {(!isLoading && <Title className={classes.title}>{props.data?.title}</Title>) || (
              <Skeleton className={classes.title} height={25} radius='md' width={'80%'} />
            )}

            {(!isLoading && (
              <Text weight={500} size='lg' mb={5}>
                {props.data?.date}
              </Text>
            )) || <Skeleton mb={5} height={15} radius='md' width={'20%'} />}

            {(!isLoading && (
              <Text size='sm' mb='md' color={'dark'} lineClamp={12}>
                {props.data?.explanation}
              </Text>
            )) || (
              <>
                <Skeleton mb='md' height={100} radius='md' />
              </>
            )}

            {(!isLoading &&
              ((props.data?.copyright && (
                <Text size='sm' color='dimmed'>
                  &copy; {props.data?.copyright}
                </Text>
              )) || <></>)) || (
              <>
                <Skeleton height={15} radius='md' width={'20%'} />
              </>
            )}
          </div>
        </div>

        {(!isLoading && (
          <div className={classes.mediaContainer} onClick={() => setMediaModalOpen(true)}>
            {(props.data?.media_type === 'image' && (
              <div
                style={{
                  width: '25rem',
                  height: '25rem',
                  maxHeight: '70vw',
                  maxWidth: '70vw',
                  background: `url('${props.data?.url}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  borderRadius: '1rem',
                }}></div>
            )) || (
              <ReactPlayer
                style={{ width: '25rem', height: '25rem', maxHeight: '75vw', maxWidth: '75vw' }}
                light={props.data?.thumbnail_url}
                controls
                url={props.data?.url}
                className={classes.image}
              />
            )}
          </div>
        )) || (
          <div className={classes.image}>
            <Skeleton height={200} radius='md' />
          </div>
        )}
      </div>
    </>
  );
}
