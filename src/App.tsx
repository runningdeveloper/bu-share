// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Button, Title, Container, Flex, TextInput, Box } from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconTrash,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { useLocalStorage, useClipboard } from "@mantine/hooks";

function getCurrentLap(): number {
  const raceStartHour = 9;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let lapNumber = currentHour - raceStartHour;

  if (currentMinute > 0) {
    lapNumber += 1;
  }

  return lapNumber > 0 ? lapNumber : 0;
}

type Name = {
  name: string;
  running: boolean;
};

function sortNames(names: Name[]): Name[] {
  return names.sort((a, b) => {
    if (a.running === b.running) {
      return a.name.localeCompare(b.name);
    }
    return a.running ? -1 : 1;
  });
}

function App() {
  // const [count, setCount] = useState(0)
  // const theme = useMantineTheme();
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState("");

  const [names, setNames] = useLocalStorage({
    key: "names",
    defaultValue: [] as Name[],
  });

  const addName = (name: string) => {
    setNames([...names, { name, running: true }]);
    setEdit(false);
  };

  const removeName = (name: string) => {
    setNames(names.filter((n) => n.name !== name));
  };

  const toggleRunning = (name: string) => {
    setNames(
      names.map((n) => {
        if (n.name === name) {
          return { name, running: !n.running };
        }
        return n;
      })
    );
  };

  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Container size="xs">
      <Flex
        // gap="md"
        justify="center"
        align="center"
        direction="column"
      >
        {/* <Flex gap="xs" my="lg"> */}
        {/* <IconRun size={48} stroke={2} /> */}

        <Title my="lg" ta="center" size={60} order={1}>
          LAP {getCurrentLap()}
        </Title>
        {sortNames(names).map((name) => (
          <Flex key={name.name} gap="xs" my="xs" miw="300" align="center">
            {" "}
            {name.running ? <IconCircleCheckFilled
              size={40}
              stroke={2}
              color="#59BE23"
              onClick={() => toggleRunning(name.name)}
            />:<IconCircleXFilled
            color="#e84d50"
            size={40}
            stroke={2}
            onClick={() => toggleRunning(name.name)}
          />}{" "}
            <Title mb="-10px" ta="center" size={40} order={2}>
              {name.name}
            </Title>
            <Box style={{ flexGrow: 1 }}></Box>{" "}
            <IconTrash stroke={2} onClick={() => removeName(name.name)} />
          </Flex>
        ))}
        {/* </Flex> */}
        <Button
          my="lg"
          color="myColor"
          size="lg"
          radius="md"
          leftSection={<IconBrandWhatsapp size={30} />}
          onClick={() => {
            const text = {text: `Lap ${getCurrentLap()} 🚀\n` + names.map(n => `${n.running?"🟢":"🔴"} ${n.name}`).join("\n")}
            try{
              navigator.share(text)
            }catch(e){
              console.log(e)
              clipboard.copy(text.text)
            }
            // if (navigator && navigator.canShare(text)){
            //   navigator.share({text: "test"})
            // }else{
            //   console.log("can't share")
            // }

          }}
        >
          {clipboard.copied ? "Copied": "Share"}
        </Button>

        {edit && (
          <Flex gap="xs" my="lg" align="end">
            <TextInput
              size="lg"
              radius="md"
              label="Name"
              // description="Input description"
              placeholder="Joe"
              value={newName}
              onChange={(event) => setNewName(event.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addName(newName);
              }}
            />
            <Button
              onClick={() => addName(newName)}
              size="lg"
              color="myColor"
              radius="md"
            >
              Save
            </Button>
          </Flex>
        )}
      </Flex>
      <Button
        onClick={() => setEdit(!edit)}
        size="xs"
        color="myColor"
        variant="light"
        radius="md"
      >
        Edit
      </Button>
    </Container>
  );
}

export default App;
