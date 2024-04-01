import '@src/App.css';
import { Outlet } from 'react-router-dom';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';


import { Container, Center, Paper, Title } from '@mantine/core';

function App() {
  return (
    <Center style={{ height: '100vh' }}> {/* This centers content vertically */}
      <Container w={400} style={{ width: '100%' }} pb={"md"}> {/* Controls max width */}
        <Title order={2} c='red' align="center">WARNING: DO NOT CLOSE THIS WINDOW OR YOUR TIME {'WON\'T'} BE RECORDED</Title>
        <Paper p={"lg"} shadow="xs"> {/* Optional: Adds styling to the form */}
          <Outlet />
        </Paper>
      </Container>
    </Center>
  );
}

export default App;

