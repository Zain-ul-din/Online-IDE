import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from '@monaco-editor/react';
import "monaco-themes/themes/Night Owl.json";
import MarkDownContent from "./Markdown";
import { useIDE } from "../lib/IDEProvider";

export default function IDE() {

  const handleRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const leftWindowRef = useRef<HTMLDivElement>(null);

  const [leftWinWidth, setLeftWinWidth] = useState<string>("45%");
  const [editorWinHeight, setEditorWinHeight] = useState<string>("70%");
  const [disableInteractions, setDisableInteractions] = useState<boolean>(false)

  const editorHandleRef = useRef<HTMLDivElement>(null)
  const editorTopWindowRef = useRef<HTMLDivElement>(null)

  const [IDEContext, setIDEContext] = useIDE()

  console.log(IDEContext);
  
  /** 
   * https://github.com/suren-atoyan/monaco-react/discussions/201
  */
  const monaco = useMonaco()
  useEffect(()=> {
    if(!monaco) return;

    import("monaco-themes/themes/Night Owl.json")
    .then((data)=>{
      monaco.editor.defineTheme("night-owl", data)
    })
    .then(() => monaco.editor.setTheme('night-owl'))
  },[monaco])
  

  useEffect(() => {

    const editorWindowMouseDown = (e: MouseEvent)=> {
      e.preventDefault();

      const parentRect = leftWindowRef.current?.getBoundingClientRect() as DOMRect;
      const topWindowRect = editorTopWindowRef.current?.getBoundingClientRect() as DOMRect
      
      const initialY = e.clientY;
      const initialHeight = topWindowRect.height;

      const onMouseMove = (e: MouseEvent)=> {
        const dy = e.clientY - initialY;
        const newHeight = initialHeight + dy;

        const newPercentage = (newHeight * 100) / parentRect.height;
        setEditorWinHeight(`${newPercentage}%`);
      }

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    editorHandleRef.current?.addEventListener("mousedown", editorWindowMouseDown);


    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();

      const parentRect = parentRef.current?.getBoundingClientRect() as DOMRect;
      const leftWindowRect =
      leftWindowRef.current?.getBoundingClientRect() as DOMRect;
      
      const initialX = e.clientX;
      const initialWidth = leftWindowRect.width;
      
      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - initialX;
        const newWidth = initialWidth + dx;
        
        const newPercentage = (newWidth * 100) / parentRect.width;
        setLeftWinWidth(`${newPercentage}%`);
      };
      
      const onMouseUp = () => {
        setDisableInteractions(false)
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      
      setDisableInteractions(true)
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    handleRef.current?.addEventListener("mousedown", onMouseDown);

    return () => {
      handleRef.current?.removeEventListener("mousedown", onMouseDown);
      editorHandleRef.current?.removeEventListener("mousedown", editorWindowMouseDown);
    };
  }, []);

  return (
    <Flex w="100%" h="100%" flex={1} ref={parentRef}
      maxH={'100%'}
    >
      <Flex w={leftWinWidth} 
        ref={leftWindowRef} 
        className={disableInteractions ? "disable-interaction" : ""}
        py={4}
        flexDir={'column'}
      >
        <Flex w={'100%'} height={editorWinHeight}
          ref={editorTopWindowRef}
        >
          <Editor 
            height={'100%'}
            defaultValue={`// add your code`}
            theme="dark"
            defaultLanguage="cpp"
            value={IDEContext.input}
            onChange={(value)=>{
              setIDEContext((newState)=> {
                return ({...newState, input: value as string })
              })
            }}
          />
        </Flex>

        {/* handle resize */}
        <Flex height={'4px'} bg={'gray.200'} width={'100%'}
          cursor={'row-resize'}
          ref={editorHandleRef}
        >
          {/*  */}
        </Flex>

        <Flex flex={1} 
          position={'relative'}
          pt={10} px={2} flexDir={'column'}
          color={IDEContext.status == 0 ? 'green.300' : 'red.200'}
        >
            <Flex position={'absolute'} left={0} top={0}
              p={1} bg={'gray.200'} px={3} color={'white'}
            >
              Output
            </Flex>
            {IDEContext.output.split("\n").map((line, idx)=>{
              return <Flex key={idx}>{line}</Flex>
            })}
        </Flex>
      </Flex>
      <Flex
        h="100%"
        w="4px"
        bg="gray.200"
        cursor="col-resize"
        ref={handleRef}
      >
        {" "}
      </Flex>
      <Flex flex={1} 
        flexDir={'column'}
        maxH={'100%'}
        className={disableInteractions ? "disable-interaction" : ""}
        overflowY={'auto'} pb={10}
      >
        <MarkDownContent>
{`# Online IDE

A online platform allows developer to run c++ code online.

## Getting Started

- copy following code 
- paste code in editor window and click on run
\`\`\`cpp
#include<iostream> 

// driver code
int main () {
  std::cout << "hello world \\n";
  return EXIT_SUCCESS:
}
\`\`\`

## Testing your code

\`\`\`c++

#include<iostream>
#include<cassert>

int sum(int a, int b) {
    return a+b;
}

int main() {
    // add more test here
    assert(sum(10,10) == 20);
    std::cout << "All Test has been passed \\n";
    return EXIT_SUCCESS;
}

\`\`\`

--------------

### Credits

- **Zain Ul Din (fa-2020/BSCS/147)**
- **Amara khan (fa-2021/BSCS/359)**
<br/>
<br/>


`}
        </MarkDownContent>
      </Flex>
    </Flex>
  );
}
