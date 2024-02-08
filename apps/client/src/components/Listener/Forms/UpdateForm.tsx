import { useForm } from 'react-hook-form';

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SheetClose,
  Switch,
  Trade,
  useToast,
} from '@org/shared';

import useTrade from '../../../hooks/useTrade';
import { useCallback } from 'react';

export default function UpdateForm({ tradeId }: { tradeId: number }) {
  const { updateTrader, trade } = useTrade(tradeId);

  const { toast } = useToast();

  const form = useForm({
    defaultValues: trade,
  });

  const onSubmit = useCallback(
    (formValues: Trade, event: unknown) => {
      if (trade.active && formValues.active)
        return toast({
          title: 'Information',
          description: "You can't update the trader whilst his active",
          variant: 'destructive',
        });

      updateTrader
        .mutateAsync({
          data: {
            active: formValues?.active,
            buyQuantity: Number(formValues?.buyQuantity),
            sellQuantity: Number(formValues?.sellQuantity),
            interval: Number(formValues?.interval),
          },
        })
        .then(() =>
          toast({
            title: 'Information',
            description: 'Information updated successfully',
          })
        );
    },
    [updateTrader, trade, toast]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buyQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy quantity</FormLabel>
              <FormControl>
                <Input placeholder="Buy quantity" {...field} type="number" />
              </FormControl>
              <FormDescription>This is your buy quantity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sellQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sell quantity</FormLabel>
              <FormControl>
                <Input placeholder="Sell quantity" {...field} type="number" />
              </FormControl>
              <FormDescription>This is your sell quantity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <FormControl>
                <Input
                  placeholder="Buy/Sell interval"
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormDescription>
                This is your interval to buy/sell.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetClose>
          <Button type="submit">Confirm</Button>
        </SheetClose>
      </form>
    </Form>
  );
}
