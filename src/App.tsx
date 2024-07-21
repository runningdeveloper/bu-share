import { Button, Title, Container, Flex, TextInput, Box } from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconTrash,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { useLocalStorage, useClipboard } from "@mantine/hooks";
import { differenceInHours } from "date-fns";
import { DateTimePicker } from "@mantine/dates";

function getCurrentLap(start: Date): number {
  return differenceInHours(new Date(), start) + 1;
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
  const [edit, setEdit] = useState(null as "date" | "name" | null);
  const [newName, setNewName] = useState("");
  // const [newStart, setNewStart] = useState(new Date());

  const [names, setNames] = useLocalStorage({
    key: "names",
    defaultValue: [] as Name[],
  });

  const [start, setStart] = useLocalStorage({
    key: "start",
    defaultValue: new Date(),
  });

  const startDate = new Date(start);

  const addName = (name: string) => {
    setNames([...names, { name, running: true }]);
    setEdit(null);
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

  const currentLap = getCurrentLap(start);

  return (
    <Container size="xs">
      <Flex align="center" direction="column">
        <Title mt="lg" mb="-20px" pb={0} ta="center" size={80} order={1}>
          LAP {currentLap}
        </Title>
        <Title mb="lg" ta="center" size={20} order={2}>
          {currentLap * 6.7} km
        </Title>
        {sortNames(names).map((name) => (
          <Flex key={name.name} gap="xs" mb="xs" miw="300" align="center">
            {" "}
            {name.running ? (
              <IconCircleCheckFilled
                size={40}
                stroke={2}
                color="#59BE23"
                onClick={() => toggleRunning(name.name)}
              />
            ) : (
              <IconCircleXFilled
                color="#e84d50"
                size={40}
                stroke={2}
                onClick={() => toggleRunning(name.name)}
              />
            )}{" "}
            <Title mb="-10px" ta="center" size={40} order={2}>
              {name.name}
            </Title>
            <Box style={{ flexGrow: 1 }}></Box>{" "}
            <IconTrash stroke={2} onClick={() => removeName(name.name)} />
          </Flex>
        ))}
        <Button
          my="lg"
          color="myColor"
          size="lg"
          radius="md"
          leftSection={<IconBrandWhatsapp size={30} />}
          onClick={() => {
            const text = {
              text:
                `Lap ${currentLap} - ${currentLap * 6.7} km done 🚀\n` +
                names
                  .map((n) => `${n.running ? "🟢" : "🔴"} ${n.name}`)
                  .join("\n"),
            };
            try {
              navigator.share(text);
            } catch (e) {
              console.log(e);
              clipboard.copy(text.text);
            }
          }}
        >
          {clipboard.copied ? "Copied" : "Share"}
        </Button>

        {edit === "name" && (
          <>
            <Flex gap="xs" my="lg" align="end">
              <TextInput
                size="lg"
                radius="md"
                label="Name"
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
          </>
        )}
        {edit === "date" && (
          <>
            <Flex gap="xs" my="lg" align="end">
              <DateTimePicker
                clearable
                value={startDate}
                label="Pick date and time"
                placeholder="Pick date and time"
                onChange={(value) => {
                  if (value && value instanceof Date) setStart(value);
                }}
              />
            </Flex>
          </>
        )}
      </Flex>
      <Button
        onClick={() => {
          if (edit === null) {
            setEdit("date");
          } else {
            setEdit(null);
          }
        }}
        size="xs"
        color="myColor"
        variant="light"
        radius="md"
      >
        Edit
      </Button>
      {" "}
      <Button
        onClick={() => {
          if (edit === null) {
            setEdit("name");
          } else {
            setEdit(null);
          }
        }}
        size="xs"
        color="myColor"
        variant="light"
        radius="md"
      >
        Add Name
      </Button>
    </Container>
  );
}

export default App;
