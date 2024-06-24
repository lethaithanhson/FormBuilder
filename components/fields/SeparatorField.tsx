"use client";

import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementsType = 'SeparatorField'

export const SeparatorFieldFormElement: FormElement = {
    type,

    construct: (id) => ({
        id,
        type,
    }),

    designerBtnElement: {
        icon: RiSeparator,
        label: "Separator Field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: ()=> true
}


// Chi tiết element
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
   return (
    <p className="">No properties for this element</p>
   )
}

// Form sau khi tạo 
function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
   
    return (
        <Separator />
    )
}

// 
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">Separator field</Label>
            <Separator />
        </div>
    )
}

