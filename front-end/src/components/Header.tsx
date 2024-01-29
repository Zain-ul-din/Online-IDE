import { Button, Flex, Heading } from "@chakra-ui/react";
import { useIDE } from "../lib/IDEProvider";
import { useState } from "react";

export default function Header() {

  const [IDEContext, setIDEContext] = useIDE()
  const [loading, setLoading] = useState<boolean>(false);

  
  return <Flex w={'100%'} p={'3'} borderBottom={'1px solid'}
    borderColor={'gray.200'} alignItems={'center'} 
  >
    <Heading fontSize={'xl'} color={'green.400'}>
      {`<> Online IDE 👨‍💻 </>`}
    </Heading>

    <Flex ml={'auto'} gap={4}>
      <Button size={'md'} variant={'outline'}
        onClick={()=>{
          setLoading(true)
          fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code: IDEContext.input
            })
          })
          .then(res=> res.json())
          .then(res=> {
            setIDEContext(newState=> {
              return ({...newState, output: res.output, status: res.code })
            })
          }).finally(()=> {
            setLoading(false)
          })
        }}
        isLoading={loading}
      >
        ✔ Run
      </Button>
    </Flex>
  </Flex>
}

