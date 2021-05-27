import {ApolloClient, InMemoryCache, gql} from "@apollo/client";
import Head from "next/head";
import {useState} from "react";
import {
  Heading,
  Box,
  Flex,
  Input,
  IconButton,
  useToast,
  Stack,
} from "@chakra-ui/react";
import {SearchIcon, CloseIcon} from "@chakra-ui/icons";
import styles from "../styles/Home.module.css";
import Character from "../Components/Characters";

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = useState(initialState.characters);
  const [search, setSearch] = useState("");
  const toast = useToast();
  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2x1" mb={8}>
          Rick and Morty
        </Heading>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await fetch("/api/SearchCharacters", {
              method: "post",
              body: search,
            });
            const {characters, error} = await result.json();
            if (error) {
              toast({
                position: "bottom",
                title: "Error Occured",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack maxWidth="350px" align="center" width="100%" isInline mb={8}>
            <Input
              placeholder="Search"
              value={search}
              border="none"
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton
              colorScheme="blue"
              aria-label="Search Database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
            />
            <IconButton
              colorScheme="red"
              aria-label="reset button"
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(initialState.characters);
              }}
              type="submit"
            />
          </Stack>
        </form>
        <Character characters={characters} />
      </Box>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });

  const {data} = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            origin {
              id
              name
              dimension
            }
            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },
  };
}
