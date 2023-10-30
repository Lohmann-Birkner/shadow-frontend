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

interface Props {
  data: string | undefined;
  patient_id: number| undefined;
}

function Documentation({ data, patient_id }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const addDocumentation = () => {
    if (textareaRef.current) {
      const textareaValue = textareaRef.current.value;
      console.log(textareaValue)

      if (!textareaValue) {
        return;
      }
      addDocument(patient_id, textareaValue);
      setIsEditMode(false);
    }
  };
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
            <>
              <Textarea
                className="h-60"
                autoFocus={true}
                defaultValue={data}
                ref={textareaRef}
              />
              <div className="flex w-full">
                <Button
                  className="mt-5 ml-auto hover:bg-slate-200"
                  variant={"secondary"}
                  onClick={addDocumentation}
                >
                  <FormattedMessage id="Save" />
                </Button>
              </div>
            </>
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
