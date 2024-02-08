import { ScrollArea } from '@org/shared';

export default function Logs({ messages = [] }: { messages: string[] }) {
  return (
    <ScrollArea className="rounded-md border h-[200px]">
      {messages?.map((message: string, index: number) => (
        <p key={index} className="px-3.5">
          {message}
        </p>
      ))}
    </ScrollArea>
  );
}
