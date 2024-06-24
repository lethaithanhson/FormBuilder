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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = 'ParagraphField'

const extraAttributes = {
    text: "Text here",
}

// validation cho element
const propertiesSchema = z.object({
    text: z.string().min(2).max(500),
})

type propertiesSchemaType = z.infer<typeof propertiesSchema>

export const ParagraphFieldFormElement: FormElement = {
    type,

    construct: (id) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: BsTextParagraph,
        label: "Paragraph Field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true
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
            text: element.extraAttributes.text,

        }
    })

    const applyChanges = (values: propertiesSchemaType) => {
        const { text } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                text
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
                    name="text"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={5}
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

    const { text } = element.extraAttributes
    return (
        <p >{text}</p>
    )
}

// 
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { text } = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">Paragraph field</Label>
            <p >{text}</p>
        </div>
    )
}

