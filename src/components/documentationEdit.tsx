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
import { FormattedMessage } from "react-intl";
import { Button } from "./ui/button";
import { DocumentationT, PatientT } from "../../types";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { addDocument, updateDocument } from "@/api";
import { useRouter } from "next/router";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FormatGender } from "@/lib/utils";
import { FormatDate } from "@/lib/format-date";
import { Separator } from "@/components/ui/separator";
interface Props {
  data?: DocumentationT;
  patientData?: PatientT | undefined;
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
  index,
  patientData,
}: Props) {
  const { query } = useRouter();
  const queryClient = useQueryClient();

  let content = data && index !== undefined ? data[index].doc_text : "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doc_text: JSON.stringify(data),
    },
  });

  useEffect(() => {
    form.reset({
      doc_text: content,
    });
  }, [index, content, form]);

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
      addNewDokument.mutate(values);
      setIsEditMode(false);
      form.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="h-fit w-[40rem] flex flex-col max-w-3xl">
        {" "}
        <div className="w-full h-fit">
          <div className="font-medium flex">
            <FormattedMessage id="ins_id" />:
            <span className="font-light">{patientData?.ins_id}</span>
            <Separator className="h-5" orientation="vertical" />
          </div>{" "}
          <div className="font-medium flex">
            {" "}
            <FormattedMessage id="Name" />:{"      "}
            <span className="font-light">
              {`    ${patientData?.last_name}`}
            </span>
          </div>
          <div className="font-medium flex">
            {" "}
            <FormattedMessage id="first_name" />:{" "}
            <span className="font-light">{`${patientData?.first_name}`}</span>
          </div>
          <div className="font-medium flex">
            <FormattedMessage id="Date_of_birth" />:{" "}
            <span className="font-light">
              {" "}
              {FormatDate(patientData?.Date_of_birth)}
            </span>
          </div>
          {/* <CardTitle className="mb-1 text-lg">
                <FormattedMessage id="Gender" />:{" "}
                <span className="font-light">
                  {FormatGender(patientData?.Gender)}
                </span>
              </CardTitle>
              <CardTitle className="text-lg">
                <FormattedMessage id="ZIP_code" />:{" "}
                <span className="font-light">{patientData?.ZIP_code}</span>
              </CardTitle> */}
        </div>
        <AlertDialogHeader className="h-fit">
          <AlertDialogTitle className="text-2xl ">
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
                    <Textarea className="h-96 w-full " {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-8">
              <AlertDialogCancel>
                {" "}
                <FormattedMessage id="Cancel" />
              </AlertDialogCancel>

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
