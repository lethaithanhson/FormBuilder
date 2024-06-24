"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error { };

// lấy data dashboard
export async function GetFormStats() {
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundError()
    }

    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true,
        }
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0

    let submissionsRate = 0
    if (visits > 0) {
        submissionsRate = (submissions / visits) * 100
    }
    const bounceRate = 100 - submissionsRate
    return { visits, submissions, submissionsRate, bounceRate }
}


// tạo form 
export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data)
    if (!validation) {
        throw new Error('From not valid')
    }

    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }

    const { name, description } = data
    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description
        }
    })
    if (!form) {
        throw new Error('Something went wrong')
    }
    return form.id
}

// Danh sach form da tao
export async function GetForms() {
    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

// Chi tiet form
export async function GetFormById(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}
export async function UpdateFormContent(id: number, content: string) {
    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            content: content
        }
    })
}

export async function PublishForm(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.update({
        data: {
            published: true,
        },
        where: {
            userId: user.id,
            id
        }
    })
}

// lấy form by id
export async function GetFormContentByUrl(formUrl: string) {
    return await prisma.form.update({
        select: {
            content: true
        },
        data: {
            visits: {
                increment: 1
            }
        },
        where: {
            shareURL: formUrl
        }
    })
}
export async function SubmitForm(formUrl: string, content: string) {
    return await prisma.form.update({

        data: {
            submissions: {
                increment: 1
            },
            FromSubmissions: {
                create: {
                    content
                }
            }
        },
        where: {
            shareURL: formUrl,
            published: true
        }
    })
}
export async function GetFormWithSubmissions(id: number) {
    const user = await currentUser()
    if (!user) {
        throw new UserNotFoundError()
    }
    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        },
        include: {
            FromSubmissions: true
        }
    })
}
