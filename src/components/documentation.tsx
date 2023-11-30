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
import { MoreHorizontal, Pencil, PlusSquare, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { FormattedMessage } from "react-intl";
import { addDocument, deleteDocument, getDocumentById } from "@/api";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import TaskDialog from "./forms/task-dialog";
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
import { Input } from "./ui/input";
import DocumentationEdit from "./documentationEdit";

const FormSchema = z.object({
  doc_text: z.string(),
});

interface Props {
  queryId: string | string[] | undefined;
}

function Documentation({ queryId }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doc_id, setDoc_id] = useState<number>();
  const [dialogType, setDialogType] = useState<"edit" | "add">("edit");
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data } = useQuery(
    ["documentation", queryId],
    () => {
      const res = getDocumentById(queryId as string);
      //   res.then((data) => form.setValue("DocumentationText", data?.doc_text));
      return res;
    },
    {
      enabled: !!queryId,
    }
  );

  const onActionClick = (dialogType: "edit" | "add") => {
    setDialogType(dialogType);
    setIsEditMode(true);
  };

  const { mutate: deleteDocu } = useMutation({
    mutationFn: () => deleteDocument(doc_id as number),
    onSuccess: () => {
      queryClient.invalidateQueries(["documentation"]);
    },
  });

  const dialogDeleteDocu = (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <FormattedMessage id="Are_you_sure" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <FormattedMessage id="Make_sure_to_delete" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <FormattedMessage id="Cancel" />
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => deleteDocu()}
          >
            <FormattedMessage id="Aktion_delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <>
      <Card className="mt-5">
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <FormattedMessage id="Dokument" />
            </CardTitle>
            <Button onClick={() => onActionClick("add")} variant={"ghost"}>
              {" "}
              <PlusSquare className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* /* {isEditMode ? (
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit((data) =>
                //   onSubmit(data.DocumentationText))}
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
            // </Form> */}

          <ScrollArea className="h-72 rounded-md ">
            {data?.map((el, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 "
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none w-fit">
                    {el.doc_text}
                  </p>
                  <div className="flex justify-between ">
                    <p className="text-sm text-muted-foreground p-1 w-full">
                      {el.created_at.slice(0, 10)}
                    </p>
                    <div className="self-end ">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal className="h-4 w-4 " />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-6 border-1 ">
                          <DropdownMenuItem
                            onClick={() => {
                              onActionClick("edit");
                              setDoc_id(el.id);
                            }}
                            className="flex justify-between"
                          >
                            <Pencil className="w-4 h-4 m-1" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setIsDialogOpen(true);
                              setDoc_id(el.id);
                            }}
                            className="flex justify-between"
                          >
                            <Trash2 className="w-4 h-4 m-1" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {isDialogOpen ? dialogDeleteDocu : null}
                    </div>
                  </div>
                </div>

                {/* {dialogType === "edit" ? dialogEditTask : dialogDeleteTask} */}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <DocumentationEdit
        open={isEditMode}
        setOpen={setIsEditMode}
        data={data}
        dialogType={dialogType}
        setIsEditMode={setIsEditMode}
        doc_id={doc_id}
      />
    </>
  );
}

export default Documentation;
