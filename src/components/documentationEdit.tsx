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
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { addDocument, updateDocument } from "@/api";
import { useRouter } from "next/router";

interface Props {
  data?: DocumentationT;
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogType: string;
  setIsEditMode: (open: boolean) => void;
  doc_id:number|undefined
}
const FormSchema = z.object({
  doc_text: z.string(),
});

export default function DocumentationEdit({
  open,
  setOpen,
  data,
  dialogType,
  setIsEditMode,
  doc_id
}: Props) {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const addNewDokument = useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      addDocument(query.id, formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation", query.id] });
    },
  });
  
  const updateDocumentation=useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      updateDocument(doc_id,formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation"] });
    },
  })
  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (dialogType==="edit") {
      updateDocumentation.mutate(values)
      setIsEditMode(false);
    } else {
      console.log("new add")
      addNewDokument.mutate(values);
      setIsEditMode(false);
      form.reset()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {dialogType === "edit" ? (
              <FormattedMessage id="Task_edit" />
            ) : (
              <FormattedMessage id="Add_task" />
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className="mt-4 "
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
          >
            <FormField
              control={form.control}
              name="doc_text"
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
                {dialogType === "edit" ? (
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
function setIsEditMode(arg0: boolean) {
  throw new Error("Function not implemented.");
}
