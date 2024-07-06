import { ReactNode, Suspense } from 'react';
import { GetFormStats, GetForms } from '@/actions/form'
import { formatDistance } from 'date-fns';
import { Form } from '@prisma/client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import CreateFormBtn from '@/components/CreateFormBtn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { LuView } from "react-icons/lu";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { TbArrowBounce } from "react-icons/tb";
import { BiRightArrowAlt } from "react-icons/bi";
import { HiCursorClick } from "react-icons/hi";
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className='container pt-4'>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <CardStatsWrapper />
      </Suspense>
      <h2 className='text-xl font-bold col-span-2 mt-10'>Your froms</h2>
      <Separator className='my-6 mt-1' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateFormBtn />
        <Suspense fallback={<FormCardSkeleton />}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}


const CardStatsWrapper = async () => {
  const stats = await GetFormStats()
  return <StatsCards loading={false} data={stats} />
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>
  loading: boolean
}
const StatsCards = (props: StatsCardProps) => {
  const { data, loading } = props
  return <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
    <StatsCard
      title="Total visits"
      icon={<LuView className="text-blue-600" />}
      helperText="All time form visits"
      value={data?.visits.toLocaleString() || ''}
      loading={loading}
    // className="shadow-md shadow-blue-600"
    />
    <StatsCard
      title="Total submissions"
      icon={<FaWpforms className="text-yellow-600" />}
      helperText="All time form submissions"
      value={data?.submissions.toLocaleString() || ''}
      loading={loading}
    // className="shadow-md shadow-yellow-600"
    />
    <StatsCard
      title="Submission rate"
      icon={<HiCursorClick className="text-green-600" />}
      helperText="Visits that result in form submission"
      value={data?.submissionsRate.toLocaleString() + "%" || ''}
      loading={loading}
    // className="shadow-md shadow-green-600"
    />
    <StatsCard
      title="Bounce rate"
      icon={<TbArrowBounce className="text-red-600" />}
      helperText="Visits that leaves without interacting"
      value={data?.visits.toLocaleString() + "%" || ''}
      loading={loading}
    // className="shadow-md shadow-red-600"
    />
  </div>
}

export const StatsCardsSkeleton = ()=>{
  return(
    <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
       {[1,2,3,4].map((item)=>(
        <Skeleton key={item} className='border dark:border-white/10 border-primary/20 h-[114px] w-full' />
       ))}
    </div>
  )
}

export const StatsCard = ({ className, helperText, icon, loading, title, value }: {
  title: string,
  value: string,
  helperText: string,
  className?: string,
  loading: boolean,
  icon: ReactNode
}) => {
  return (
    <Card className={cn('bg-card dark:bg-slate-800/25 shadow dark:border-white/10 relative', className)}>
      <CardHeader className='flex flex-row items-center justify-between py-4 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <div className='h-16 w-16 rounded-full flex justify-center items-center bg-slate-100 dark:bg-slate-800/75 absolute top-1/2 right-4 text-4xl -translate-y-1/2'>
          {icon}
        </div>
      </CardHeader>
      <CardContent className='py-4 pt-0'>
        <div className='text-2xl font-bold'>
          {loading &&
            <Skeleton>
              <span className='opacity-0'>0</span>
            </Skeleton>}
          {!loading && value}
        </div>
        <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
      </CardContent>
    </Card>
  )
}

const FormCardSkeleton = () => {
  return <Skeleton className='border-2 border-primary/20 h-[190px] w-full' />
}

const FormCards = async () => {
  const forms = await GetForms()
  return <>
    {forms.map(form => (
      <FormCard key={form.id} form={form} />
    ))}
  </>
}

const FormCard = ({ form }: { form: Form }) => {
  return (
    <Card className='bg-card dark:bg-slate-800/25 shadow dark:border-white/10'>
      <CardHeader className='py-4'>
        <CardTitle className='flex items-center justify-between gap-2'>
          <span className='truncate font-bold'>
            {form.name}
          </span>
          {form.published && <Badge className='bg-[#adfa1d]'>Published</Badge>}
          {!form.published && <Badge variant={'secondary'}>Draft</Badge>}
        </CardTitle>
        <CardDescription className='inline-flex items-center justify-between text-sm text-muted-foreground'>
          <span>
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true
            })}
          </span>
          {form.published && (
            <span className='flex items-center gap-2'>
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
        {form.description || 'No description'}
      </CardContent>
      <CardFooter className='pb-4'>
        {form.published && (
          <Button asChild className='w-full mt-2 text-md gap-4'>
            <Link href={'/forms/' + form.id}>
              View submission
              <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button variant={'secondary'} asChild className='w-full mt-2 text-md gap-4'>
            <Link href={'/builder/' + form.id}>
              Edit form
              <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}