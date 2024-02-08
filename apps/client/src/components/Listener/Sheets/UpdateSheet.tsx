import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@org/shared';

import UpdateForm from '../Forms/UpdateForm';

export default function UpdateSheet({ tradeId }: { tradeId: number }) {
  return (
    <Sheet>
      <SheetTrigger>
        <MixerHorizontalIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Trade information update</SheetTitle>
          <SheetDescription>
            <UpdateForm tradeId={tradeId} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
