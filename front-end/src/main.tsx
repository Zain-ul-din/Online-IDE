import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import './index.css'
import theme from './lib/theme.ts'
import Header from './components/Header.tsx'
import { IDEProvider } from "./lib/IDEProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <IDEProvider>
    <Flex flexDir={'column'} height={'100%'}>
      <Header />
      <App />
    </Flex>
    </IDEProvider>
  </ChakraProvider>
)

