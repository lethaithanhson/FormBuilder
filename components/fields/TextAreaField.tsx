"use client";

import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";

const type: ElementsType = 'TextAreaField'

const extraAttributes = {
    label: "Text area",
    helperText: "Helper text",
    required: false,
    placeHolder: "Value here...",
    rows: 3
}

// validation cho element
const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeHolder: z.string().max(50),
    rows: z.number().min(1).max(10)
})

type propertiesSchemaType = z.infer<typeof propertiesSchema>

export const TextAreaFieldFormElement: FormElement = {
    type,

    construct: (id) => ({
        id,
        type,
        extraAttributes
    }),

    designerBtnElement: {
        icon: BsTextareaResize,
        label: "TextArea Field",
    },

    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string) => {
        const element = formElement as CustomInstance;
        if (element.extraAttributes.required) {
            return currentValue.length > 0
        }
        return true
    },
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
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeHolder: element.extraAttributes.placeHolder,
            rows: element.extraAttributes.rows
        }
    })

    const applyChanges = (values: propertiesSchemaType) => {
        const { helperText, label, placeHolder, required, rows } = values
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                required,
                placeHolder,
                rows,
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
                    name="label"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The label for the field.<br />It will be above the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*---- PLACEHOLDER */}
                <FormField
                    control={form.control}
                    name="placeHolder"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>PlaceHolder</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The placeHolder for the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*---- HELPER TEXT */}
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Helper text</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') e.currentTarget.blur()
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The helper text for the field.<br />It will be below the field.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*---- ROWS */}
                <FormField
                    control={form.control}
                    name="rows"
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Rows {form.watch("rows")}</FormLabel>
                            <FormControl>
                                <Slider
                                    defaultValue={[field.value]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) => {
                                        field.onChange(value[0])
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/*---- REQUIRED */}
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                                <FormDescription>
                                    The helper text for the field.<br />It will be below the field.
                                </FormDescription>
                            </div>
                            <FormControl >
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
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
    submitValue,
    isInvalid,
    defaultValue
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string
}) {
    const element = elementInstance as CustomInstance
    const [value, setValue] = useState(defaultValue || '')
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid]);

    const { helperText, label, placeHolder, required, rows } = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "border-red-500")}>
                {label}
                {required && "*"}
            </Label>
            <Textarea
                className={cn(error && "text-red-500")}
                rows={rows}
                placeholder={placeHolder}
                onChange={(e) => { setValue(e.target.value) }}
                onBlur={(e) => {
                    if (!submitValue) return
                    const valid = TextAreaFieldFormElement.validate(element, e.target.value)
                    setError(!valid)
                    if (!valid) return
                    submitValue(element.id, e.target.value)
                }}
                value={value}
            />
            {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
        </div>
    )
}

// 
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { helperText, label, placeHolder, required } = element.extraAttributes
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Textarea readOnly disabled placeholder={placeHolder} />
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
        </div>
    )
}

