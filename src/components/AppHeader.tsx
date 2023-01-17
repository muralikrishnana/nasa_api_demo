import { Container, createStyles, Header, Text } from '@mantine/core';
import Image from 'next/image';
import cssClasses from './AppHeader.module.scss';

const HEADER_HEIGHT = 120;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
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

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid p={0}>
        <div className={cssClasses.logoContainer}>
          <Image src={'/assets/nasa-logo.svg'} width={60} height={60} alt={'nasa_logo'} />
          <Text size={'xs'}>National Aeronautics and Space Administration</Text>
        </div>
        <div className={cssClasses.headerTitle}>
          <Text ta='center' fz='xl' fw={600} tt='uppercase'>
            Astronomy Picture of the Day
          </Text>
        </div>
      </Container>
    </Header>
  );
}
