import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { FormattedMessage } from "react-intl";
import { addDocument } from "@/api";
import { useMutation, useQueryClient } from "react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  DocumentationText: z.string(),
});

interface Props {
  data: string | undefined;
  patient_id: number | undefined;
  refetch:()=>void;
}

function Documentation({ data, patient_id,refetch }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [docuInput, setDocuInput] = useState(data);
  const queryClient = useQueryClient();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const textareaValue = textareaRef.current?.value as string;

  console.log(data)
  console.log(typeof data);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      DocumentationText: docuInput,
    },
  });

  // console.log(patient_id)
  // console.log(textareaValue)
  const addNewDokument = useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      addDocument(patient_id as number, formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation"] });
    },
  });

  function onSubmit(docu: string) {
    console.log(111111111111);
    addNewDokument.mutate({ doc_text: docu });
    console.group(docu);
    setIsEditMode(false);
    refetch()
    
  }
  return (
    <>
      <Card className="mt-5">
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <FormattedMessage id="Dokument" />
            </CardTitle>
            <Button
              className={cn(isEditMode && "bg-accent")}
              onClick={() => setIsEditMode(!isEditMode)}
              variant={"ghost"}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditMode ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(data.DocumentationText)
                )}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="DocumentationText"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea className="h-60" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          ) : data ? (
            data
          ) : (
            "Keine Documentation"
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Documentation;
