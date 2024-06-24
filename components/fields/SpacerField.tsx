"use client";

import { ElementsType, FormElement, FormElementInstance } from "../FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";

const type: ElementsType = 'SpacerField'

const extraAttributes = {
    height: 20, // 20px
}

// validation cho element
const propertiesSchema = z.object({
    height: z.number().min(5).max(200),
})

type propertiesSchemaType = z.infer<typeof propertiesSchema>

export const SpacerFieldFormElement: FormElement = {
    type,

    construct: (id) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: LuSeparatorHorizontal,
        label: "Spacer Field",
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
            height: element.extraAttributes.height,

        }
    })

    const applyChanges = (values: propertiesSchemaType) => {
        const { height } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                height
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
                    name="height"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Height (px): {form.watch('height')}</FormLabel>
                            <FormControl>
                                <Slider
                                    className="pt-2"
                                    defaultValue={[field.value]}
                                    min={5}
                                    max={200}
                                    step={1}
                                    onValueChange={(value) => {
                                        field.onChange(value[0]);
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

    const { height } = element.extraAttributes
    return (
        <div style={{
            height: height,
            width: '100%'
        }}></div>
    )
}

// 
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { height } = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="text-muted-foreground">Spacer field: {height}px</Label>
            <LuSeparatorHorizontal className="h-8 w-8" />
        </div>
    )
}

