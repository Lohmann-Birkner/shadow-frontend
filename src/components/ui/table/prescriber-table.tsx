import React from "react";
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "../tooltip";
import { Info } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { PrescriberT } from "../../../../types";

interface Props {
    prescriberId: number;
    data: PrescriberT;
}

function PrescriberTable({ data, prescriberId }: Props) {
    return data ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center">
                    {prescriberId}
                    <Info className="w-4 h-4 ml-1" />
                </TooltipTrigger>
                <TooltipContent className="text-left p-3">
                    <div className="flex flex-col space-y-2">
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="prescriber_group_id" />
                            </span>{" "}
                            <p>{data.prescriber_group_id}</p>
                        </div>
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="physician_ident" />
                            </span>{" "}
                            <p>{data.physician_ident}</p>
                        </div>
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="description" />
                            </span>{" "}
                            <p>{data.description}</p>
                        </div>
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="address_id" />
                            </span>{" "}
                            <p>{data.address_id}</p>
                        </div>
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="data_source_sgn" />
                            </span>{" "}
                            <p>{data.data_source_sgn}</p>
                        </div>
                        <div className="flex">
                            <span className="w-52 text-foreground/70">
                                <FormattedMessage id="physician_spec_description" />
                            </span>{" "}
                            <p>{data.physician_spec_description}</p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <div>{prescriberId}</div>
    );
}

export default PrescriberTable;
