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
import { addDocument, getDocumentById } from "@/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  queryId: string | string[] | undefined;
}

function Documentation({ queryId }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data } = useQuery(
    ["documentation", queryId],
    () => {
      const res = getDocumentById(queryId as string);
      res.then((data) => form.setValue("DocumentationText", data?.doc_text));
      return res;
    },
    {
      enabled: !!queryId,
    }
  );
  console.log(data);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const addNewDokument = useMutation({
    mutationFn: (formData: { doc_text: string }) =>
      addDocument(data?.insured_id as number, formData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["documentation", queryId] });
    },
  });

  function onSubmit(docu: string) {
    addNewDokument.mutate({ doc_text: docu });
    setIsEditMode(false);
  }
  return (
    <>
      <Card className="mt-5">
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <FormattedMessage id="Dokument" />
            </CardTitle>
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
          ) : (
            "Keine Documentation"
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Documentation;
