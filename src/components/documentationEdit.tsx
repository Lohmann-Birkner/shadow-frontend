import React, { useEffect, useState } from "react";
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
import { Textarea } from "./ui/textarea";

interface Props {
  data?: DocumentationT;
  // data?: {
  //   id: number;
  //   insured_id: number;
  //   user_id: number;
  //   doc_text: string;
  //   created_at: string;
  //   user_name: string;
  // } ;
  open: boolean;
  setOpen: (open: boolean) => void;
  dialogType: string | undefined;
  setIsEditMode: (open: boolean) => void;
  doc_id: number | undefined;
  index: number | undefined;
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
  doc_id,
  index
}: Props) {
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(JSON.stringify(data));
    // console.log(index);
    // console.log('--------------------------------------------------------');

  const { query } = useRouter();
  const queryClient = useQueryClient();
  
  let content = data&&(index!==undefined) ? data[index].doc_text : '';
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doc_text: JSON.stringify(data)
    },
  });

   useEffect(()=>{
     console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');
     console.log(index);
     console.log(JSON.stringify(data));
     console.log(content);
    // form.setValue('doc_text', doc_id ===0? "" : content);
    form.reset({
      doc_text: content
    });
   },[index])


  const addNewDokument = useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      addDocument(query.id, formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation", query.id] });
    },
  });

  const updateDocumentation = useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      updateDocument(doc_id, formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation"] });
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (dialogType === "edit") {
      updateDocumentation.mutate(values);
      setIsEditMode(false);
    } else {
      console.log("new add");
      addNewDokument.mutate(values);
      setIsEditMode(false);
      form.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            {dialogType === "edit" ? (
              <FormattedMessage id="Documentation_edit" />
            ) : (
              <FormattedMessage id="Documentation_add" />
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className="mt-1"
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
          >
            <FormField
              control={form.control}
              name="doc_text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="h-48" {...field} />
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
