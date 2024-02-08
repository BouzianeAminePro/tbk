import { useCallback } from 'react';

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
  useToast,
  Trade,
} from '@org/shared';

import useTrade from '../../../hooks/useTrade';

export default function AddForm() {
  const { toast } = useToast();

  const { addTrader, trade } = useTrade();

  const form = useForm({
    defaultValues: trade,
  });

  const onSubmit = useCallback(
    (formValues: Trade, event: unknown) =>
      addTrader
        .mutateAsync({
          data: {
            active: formValues?.active ?? false,
            symbol: formValues?.symbol,
            viewSymbol: formValues?.viewSymbol,
            buyQuantity: Number(formValues?.buyQuantity),
            sellQuantity: Number(formValues?.sellQuantity),
            interval: Number(formValues?.interval),
          },
        })
        .then(() =>
          toast({
            title: 'Information',
            description: 'Trader created successfully',
          })
        ),
    [addTrader, toast]
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
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input placeholder="Symbol" {...field} />
              </FormControl>
              <FormDescription>This is your symbol.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="viewSymbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>View symbol</FormLabel>
              <FormControl>
                <Input placeholder="View symbol" {...field} />
              </FormControl>
              <FormDescription>This is your view symbol.</FormDescription>
              <FormMessage />
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
