import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { FormattedMessage } from "react-intl";
import { Button } from "./ui/button";
import { DocumentationT } from "../../types";

interface Props {
  data?: DocumentationT;
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogType:string
}
const FormSchema = z.object({
  DocumentationText: z.string(),
  createdTime: z.string(),
});

export default function DocumentationEdit({ open, setOpen, data,dialogType }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit() {
    //   addNewDokument.mutate({ doc_text: docu });
    //   setIsEditMode(false);
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {dialogType==="edit" ? (
              <FormattedMessage id="Task_edit" />
            ) : (
              <FormattedMessage id="Add_task" />
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form className="mt-4 " onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="DocumentationText"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="md:h-9" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-8">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">
                {dialogType==="edit" ? (
                  <FormattedMessage id="Update" />
                ) : (
                  <FormattedMessage id="Add" />
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
