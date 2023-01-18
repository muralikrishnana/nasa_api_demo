import { ActionIcon, Card, Container, createStyles, Text, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import Image from 'next/image';
import cssClasses from './AppHeader.module.scss';

const useStyles = createStyles((theme) => ({
  inner: {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export function AppHeader() {
  const { classes } = useStyles();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <div>
      <Card
        p={0}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'fixed',
          bottom: '0.5rem',
          right: '0.5rem',
          zIndex: 10,
        }}>
        <ActionIcon
          variant='outline'
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title='Toggle color scheme'
          size={'lg'}>
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
      </Card>
      <Container className={classes.inner} fluid p={0}>
        <div className={cssClasses.logoContainer}>
          <Image src={'/assets/nasa-logo.svg'} width={60} height={60} alt={'nasa_logo'} />
          <Text size={'xs'}>National Aeronautics and Space Administration</Text>
        </div>
        <div className={cssClasses.headerTitle}>
          <Text ta='center' fw={600} tt='uppercase'>
            Astronomy Picture of the Day
          </Text>
        </div>
      </Container>
    </div>
  );
}
