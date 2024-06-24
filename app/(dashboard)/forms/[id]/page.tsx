import { GetFormById, GetFormWithSubmissions } from '@/actions/form'
import FormBuilder from '@/components/FormBuilder'
import FormLinkShare from '@/components/FormLinkShare'
import VisitBtn from '@/components/VisitBtn'
import React, { ReactNode } from 'react'
import { StatsCard } from '../../page'
import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { ElementsType, FormElementInstance } from '@/components/FormElements'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, formatDistance } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

const FormDetailPage = async ({ params }: {
    params: {
        id: String
    }
}) => {
    const { id } = params

    const form = await GetFormById(Number(id))

    if (!form) {
        throw new Error('Form not found')
    }



    const { visits, submissions } = form

    let submissionsRate = 0
    if (visits > 0) {
        submissionsRate = (submissions / visits) * 100
    }
    const bounceRate = 100 - submissionsRate

    return (
        <>
            <div className="py-8">
                <div className="container flex justify-between">
                    <h1 className="text-4xl font-bold truncate">{form.name}</h1>
                    <VisitBtn shareUrl={form.shareURL} />
                </div>
            </div>
            <div >
                <div className='container flex flex-col gap-2 items-center justify-between'>
                    <FormLinkShare shareUrl={form.shareURL} />
                    <Separator className='mt-4' />
                </div>
            </div>
            <div className="w-full pt-5 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
                <StatsCard
                    title="Total visits"
                    icon={<LuView className="text-blue-600" />}
                    helperText="All time form visits"
                    value={visits.toLocaleString() || ''}
                    loading={false}
                />
                <StatsCard
                    title="Total submissions"
                    icon={<FaWpforms className="text-yellow-600" />}
                    helperText="All time form submissions"
                    value={submissions.toLocaleString() || ''}
                    loading={false}
                />
                <StatsCard
                    title="Submission rate"
                    icon={<HiCursorClick className="text-green-600" />}
                    helperText="Visits that result in form submission"
                    value={submissionsRate.toLocaleString() + "%" || ''}
                    loading={false}
                />
                <StatsCard
                    title="Bounce rate"
                    icon={<TbArrowBounce className="text-red-600" />}
                    helperText="Visits that leaves without interacting"
                    value={visits.toLocaleString() + "%" || ''}
                    loading={false}
                />
            </div>
            <div className="container pt-5">
                <SubmissionsTable id={form.id} />
            </div>
        </>
    )
}

type Row = {
    [key: string]: string
} & {
    submittedAt: Date;
}

async function SubmissionsTable({ id }: { id: number }) {
    const form = await GetFormWithSubmissions(id)
    if (!form) {
        throw new Error("Form not found")
    }

    const formElements = JSON.parse(form.content) as FormElementInstance[];
    const columns: {
        id: string;
        label: string;
        required: boolean;
        type: ElementsType;
    }[] = []

    formElements.forEach(element => {
        switch (element.type) {
            case "TextField":
            case "NumberField":
            case "TextAreaField":
            case "DateField":
            case "SelectField":
            case "CheckboxField":
                columns.push({
                    id: element.id,
                    label: element.extraAttributes?.label,
                    required: element.extraAttributes?.required,
                    type: element.type
                })
                break;

            default:
                break;
        }
    })

    const rows: Row[] = [];
    form.FromSubmissions.forEach(submission => {
        const content = JSON.parse(submission.content)
        rows.push({
            ...content,
            submittedAt: submission.createdAt
        });
    })

    return (
        <>
            <div className='px-6 py-4 dark:bg-slate-800/25 rounded-xl border dark:border-white/10 shadow'>
                <div className='flex flex-col space-y-1.5 px-0 pb-3'>
                    <h1 className="font-semibold leading-none tracking-tight">Submissions</h1>
                    <p className='text-sm text-muted-foreground'>All answers submitted</p>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-slate-100 dark:bg-slate-800'>
                                {columns.map(column => (
                                    <TableHead key={column.id} className='uppercase'>
                                        {column.label}
                                    </TableHead>
                                ))}
                                <TableHead className='text-muted-foreground text-right uppercase'>
                                    Submitted at
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map(column => (
                                        <RowCell
                                            key={column.id}
                                            type={column.type}
                                            value={row[column.id]}
                                        />
                                    ))}
                                    <TableCell className='text-muted-foreground text-right'>
                                        {formatDistance(row.submittedAt, new Date(), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

function RowCell({ type, value }: { type: ElementsType, value: string }) {
    let node: ReactNode = value

    switch (type) {
        case 'DateField':
            if (!value) break;
            const date = new Date(value)
            node = <Badge variant={'outline'}>{format(date, "dd/MM/yyyy")}</Badge>
            break;
        case "CheckboxField":
            const checked = value === "true"
            node = <Checkbox checked={checked} disabled />
            break;
        default:
            break;
    }
    return <TableCell>{node}</TableCell>
}

export default FormDetailPage