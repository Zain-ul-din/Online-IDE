/* eslint-disable @typescript-eslint/no-explicit-any */
import Markdown from "react-markdown";
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Flex, Heading, ListItem, OrderedList, Link, Text, UnorderedList, IconButton } from "@chakra-ui/react";
import rehypeRaw from  "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyIcon } from "@chakra-ui/icons";

const chakraRenderer = ChakraUIRenderer({
  li: props=> {
      const { children } = props
      return <ListItem lineHeight={'1.6rem'}>{children}</ListItem>
  },
  ul: props => {
      const { children } = props
      return <UnorderedList my={2} mb={4} pl={1}>
          {children}
      </UnorderedList> 
  },
  ol: props => {
      const { children } = props
      return <OrderedList my={2} mb={4}>{children}</OrderedList>
  },
  a: props => {
      const { children } = props
      return  <Link href={props.href as string} style={{
              textDecoration: 'underline'
          }} target={"_blank"}
      >
          {children}
      </Link>
  },
  strong: props => {
      const { children } = props
      return <Text as="strong" 
          px={'2px'} rounded={'sm'} 
      >{children}</Text>
  },
  h1: props => {
    const { children } = props
    return <Heading as={'h1'} fontSize={'3xl'} my={3}>
        {children}
    </Heading>
  },
  h3: props => {
      const { children } = props
      return <Heading as={'h3'} fontSize={'xl'} my={3}>
          {children}
      </Heading>
  },
  h2: props => {
      const { children } = props
      return <Heading fontSize={'2xl'} my={3}>
          {children}
      </Heading>
  },
  img: props => {
      const { alt, src } = props
      return <img 
          src={src}
          alt={alt}
          style={{
              display: 'inline-block'
          }}
      />
  }
})

export default function MarkDownContent (
  { children } : 
  { children: string | null | undefined }
) 
{
    
    return <>
        <Flex 
          w={'full'}
          h={'full'}
          flexDir={'column'} 
          rounded={'md'}
          p={3}
        >
          <Markdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              ...chakraRenderer,
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                
                return !inline && match ? (
                  <Flex w={'full'} 
                    position={'relative'} 
                    flexWrap={'wrap'}
                  >
                    <Flex position={'absolute'} right={1} top={1}>
                      <IconButton 
                        size={'xs'}
                        aria-label="copy-icon"
                        icon={<CopyIcon />}
                        onClick={()=> {
                          navigator.clipboard.writeText(children)
                        }}
                      />
                    </Flex>
                    <SyntaxHighlighter 
                      lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
                      wrapLines={true} 
                      style={{
                        ...nightOwl,
                      }} PreTag="div" language={match[1]} {...props}
                      showLineNumbers customStyle={{
                        padding: '0.5rem 0',
                        margin: '0',
                        border: '1px solid var(--chakra-colors-gray-200)',
                        borderRadius: '0.3rem',
                        fontSize: '0.8rem',
                        background: 'var(--chakra-colors-gray-200)',
                        width: '100%',
                        overflowX: 'auto',
                        flex: 1
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </Flex>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {children}
          </Markdown>
        </Flex>
    </>
}