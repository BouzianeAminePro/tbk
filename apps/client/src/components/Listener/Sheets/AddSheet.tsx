import { PlusIcon } from '@radix-ui/react-icons';

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@org/shared';

import AddForm from '../Forms/AddForm';

export default function AddSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New trader</SheetTitle>
          <SheetDescription>
            <AddForm />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
