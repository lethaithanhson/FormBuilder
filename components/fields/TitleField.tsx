"use client";

import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LuHeading1 } from "react-icons/lu";

const type: ElementsType = 'TitleField'

const extraAttributes = {
    title: "Title field",
}

// validation cho element
const propertiesSchema = z.object({
    title: z.string().min(2).max(50),
})

type propertiesSchemaType = z.infer<typeof propertiesSchema>

export const TitleFieldFormElement: FormElement = {
    type,

    construct: (id) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: LuHeading1,
        label: "Title Field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: ()=> true
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

// Chi tiết element
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { updateElement } = useDesigner()
    const form = useForm<propertiesSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: 'onBlur',
        defaultValues: {
            title: element.extraAttributes.title,
          
        }
    })

    const applyChanges = (values: propertiesSchemaType) => {
        const { title } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                title
            }
        })
    }

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(event) => event.preventDefault()}
                className="space-y-3"
            >
                {/*---- LABEL */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

// Form sau khi tạo 
function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance

    const { title } = element.extraAttributes
    return (
       <p className="text-xl">{title}</p>
    )
}

// 
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { title} = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">Tilel field</Label>
           <p className="text-xl">{title}</p>
        </div>
    )
}

