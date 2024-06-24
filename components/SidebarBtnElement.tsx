import React from 'react'
import { FormElement } from './FormElements'
import { Button } from './ui/button'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

const SidebarBtnElement = ({ formElement }: { formElement: FormElement }) => {
    const { icon: Icon, label } = formElement.designerBtnElement

    const draggable = useDraggable({
        id: `designer-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtnElement: true,
        }
    })

    return (
        <Button
            ref={draggable.setNodeRef}
            variant={'outline'}
            className={cn('flex flex-col gap-2 h-[82px] w-[82px] cursor-grab p-1 whitespace-pre-wrap',
                draggable.isDragging && 'ring-2 ring-primary'
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <Icon className="h-6 w-6 text-primary cursor-grab" />
            <p className="text-[9px]">{label}</p>
        </Button>
    )
}


export const SidebarBtnElementDragOverlay = ({ formElement }: { formElement: FormElement }) => {
    const { icon: Icon, label } = formElement.designerBtnElement

    return (
        <Button
            variant={'outline'}
            className='flex flex-col gap-2 h-[82px] w-[82px] cursor-grab'
        >
            <Icon className="h-6 w-6 text-primary cursor-grab" />
            <p className="text-[9px]">{label}</p>
        </Button>
    )
}

export default SidebarBtnElement