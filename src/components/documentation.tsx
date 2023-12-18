import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatedDate } from "@/lib/utils";
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
import { PatientT } from "../../types";
import { FormatDate } from "@/lib/format-date";

const FormSchema = z.object({
  doc_text: z.string(),
});

interface Props {
  queryId: string | string[] | undefined;
  patientData: PatientT | undefined;
}

function Documentation({ queryId, patientData }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doc_id, setDoc_id] = useState<number>(0);
  const [index, setIndex] = useState<number | undefined>();
  const [dialogType, setDialogType] = useState<"edit" | "add" | undefined>();
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
      queryClient.invalidateQueries(["documentation", queryId]);
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
      <Card className="lg:mt-5 md:mt:0 rounded-md h-full w-max-[300px]" >
        <CardHeader className="pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <FormattedMessage id="Dokument" />
            </CardTitle>
            <Button
              onClick={() => {
                onActionClick("add");
                setDoc_id(0);
                setIndex(undefined);
              }}
              variant={"ghost"}
            >
              {" "}
              <PlusSquare className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className="rounded-md overflow-auto pb-5 w-max-[300px]"
            style={{ height: "39vh" }}
          >
            {data?.map((el, index) => (
              <div
                key={index}
                className="mb-4 items-start py-1 last:mb-0 last:pb-0 w-max-[300px]"
              >
                <div className="space-y-1 ">
                  <div className="flex justify-between ">
                    {" "}
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-black mr-1" />{" "}
                    <p className="leading-none w-11/12 w-max-[300px] pl-1">{el.doc_text}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className=" h-4 mr-1"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-6 border-1 ">
                        <DropdownMenuItem
                          onClick={() => {
                            onActionClick("edit");
                            setDoc_id(el.id);
                            setIndex(index);
                          }}
                          className="flex justify-between"
                        >
                          <Pencil className="w-4 h-4 m-1" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setIsDialogOpen(true);
                            setDoc_id(el.id);
                            setIndex(index);
                          }}
                          className="flex justify-between"
                        >
                          <Trash2 className="w-4 h-4 m-1" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {isDialogOpen ? dialogDeleteDocu : null}
                  </div>

                  <p className="text-sm text-muted-foreground p-1 w-full">
                    <p>
                      {FormatDate(el.created_at.split("T")[0])}{" "}
                      {`${el.created_at.split("T")[1].slice(0, 8)}`}
                    </p>
                  </p>
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
        index={index}
        patientData={patientData}
      />
    </>
  );
}

export default Documentation;
